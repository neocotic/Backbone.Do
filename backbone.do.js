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

  // Setup
  // -----

  // TODO: Document
  var Do = Backbone.Do = function(model) {
    var actions = _.result(model, 'actions');
    _.each(actions, function (action, name) {
      model[name] = function (options) {
        return Do.perform(model, action, name, options);
      };
    });

    return Do;
  };

  // TODO: Document
  Do.defaultMethod = 'GET';

  // Current version of the `Do` plugin.
  Do.VERSION = '0.1.0';

  // Map from HTTP to CRUD for our reverse usage of `Backbone.sync`.
  var typeMap = {
    POST:   'create',
    PUT:    'update',
    PATCH:  'patch',
    DELETE: 'delete',
    GET:    'read'
  };

  // Helpers
  // -------

  // TODO: Document
  function getAttributes(obj) {
    var attrs = _.result(obj, 'attrs');
    if (_.isString(attrs)) attrs = attrs.split(/\s+/);
    return attrs;
  }

  // TODO: Document
  function getOptions(model, action, name, options) {
    options = _.extend({}, action.options, options);

    var attrs = _.union(getAttributes(action), getAttributes(options));
    if (_.isEmpty(attrs)) {
      options.data = _.extend({}, _.result(action, 'data'), _.result(options, 'data'));
    } else {
      options.data = model.pick(attrs);
    }

    var base = _.result(model, 'url'),
        path = _.result(action, 'url') || Do.parseName(name),
        separator = base[base.length - 1] === '/' ? '' : '/';
    options.url = base + separator + encodeURIComponent(path);

    return options;
  }

  // Wrap an optional error callback with a fallback error event.
  function wrapError(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  }

  // Actions
  // -------

  // TODO: Document
  Do.parseName = function(name) {
    return name;
  };

  // TODO: Document
  Do.perform = function(model, action, name, options) {
    options = getOptions(model, action, name, options);

    var attributes = model.attributes;

    if (_.isUndefined(options.parse)) options.parse = true;

    var success = options.success;
    options.success = function(resp) {
      model.attributes = attributes;

      var serverAttrs = model.parse(resp, options);
      if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) return false;

      if (success) success(model, resp, options);
      model.trigger('action:' + name, model, resp, options);
      model.trigger('action', name, model, resp, options);
    };
    wrapError(model, options);

    var method = options.method && options.method.toUpperCase(),
        type   = typeMap[method] || typeMap[Do.defaultMethod];
    return model.sync(type, model, options);
  };

  // TODO: Document
  return Do;

}));
