// [Backbone.Do](http://neocotic.com/Backbone.Do)  
// Copyright (c) 2013 Alasdair Mercer  
// Freely distributable under the MIT license

(function (root, factory) {
  'use strict';

  if (typeof exports === 'object') {
    // Export module for Node.js (or similar) environments.
    module.exports = factory(require('underscore'), require('Backbone'), root);
  } else if (typeof define === 'function' && define.amd) {
    // Register as an anonymous module.
    define([ 'underscore', 'backbone' ], function (_, Backbone) {
        return factory(_, Backbone, root);
    });
  } else {
    // Fallback on a simple global variable (e.g. browsers).
    factory(root._, root.Backbone, root);
  }
}(this, function (_, Backbone, root) {
  'use strict';

  // Try our best to ensure Backbone and Underscore are available.
  _ = _ === void 0 ? root._ : _;
  Backbone = Backbone === void 0 ? root.Backbone : Backbone;

  // Initial Setup
  // -------------

  // TODO: Document
  var Do = Backbone.Do = {};

  // TODO: Document
  Do.defaultMethod = 'GET';

  // Current version of the `Do` plugin.
  Do.VERSION = '0.1.0';

  // Map from HTTP to CRUD for our reverse usage of `Backbone.sync`.
  var methodMap = {
    POST:   'create',
    PUT:    'update',
    PATCH:  'patch',
    DELETE: 'delete',
    GET:    'read'
  };

  // Actions
  // -------

  // TODO: Document
  Do.init = function(model) {
    var _this = this,
        actions = _(model).result('actions');

    _(actions).each(function (action, name) {
      model[name] = function (options) {
        return _this.perform(model, action, name, options);
      };
    });

    return this;
  };

  // TODO: Document
  Do.parseName = function(name) {
    return name;
  };

  // TODO: Document
  Do.perform = function(model, action, name, options) {
    options = _.extend({}, action.options, options);

    var attributes = model.attributes;

    this._setOptions(model, action, name, options);

    if (_(options.parse).isUndefined()) options.parse = true;

    var success = options.success;
    options.success = function(resp) {
      model.attributes = attributes;

      var serverAttrs = model.parse(resp, options);
      if (_(serverAttrs).isObject() && !model.set(serverAttrs, options)) return false;

      if (success) success(model, resp, options);
      model.trigger('action:' + name, model, resp, options);
      model.trigger('action', name, model, resp, options);
    };
    wrapError(model, options);

    var type = options.method ? options.method.toUpperCase() : Do.defaultMethod;
    return model.sync(methodMap[type], model, options);
  };

  // TODO: Document
  Do._setOptions = function(model, action, name, options) {
    var attrs = _(action).result('attrs');
    if (_(attrs).isString()) attrs = attrs.split(/\s+/);
    if (_(attrs).isEmpty()) {
      options.data = _.extend({}, _(action).result('data'), options.data);
    } else if (!options.attrs) {
      options.attrs = model.pick(attrs);
    }

    var base = _(model).result('url'),
        path = _(action).result('url') || this.parseName(name),
        separator = base[base.length - 1] === '/' ? '' : '/';
    options.url = base + separator + encodeURIComponent(path);
  };

  // Helpers
  // -------

  // Wrap an optional error callback with a fallback error event.
  function wrapError(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  }

  // TODO: Document
  return Do;

}));
