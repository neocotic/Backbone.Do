// [Backbone.Do](http://neocotic.com/Backbone.Do)
//
// Copyright (c) 2014 Alasdair Mercer
//
// Freely distributable under the MIT license

(function(root, factory) {

  'use strict';

  if (typeof exports === 'object') {
    // Export module for Node.js (or similar) environments.
    module.exports = factory(require('underscore'), require('backbone'), root);
  } else if (typeof define === 'function' && define.amd) {
    // Register as an anonymous module.
    define([ 'underscore', 'backbone' ], function(_, Backbone) {
        return factory(_, Backbone, root);
    });
  } else {
    // Fallback on a simple global variable (e.g. browsers).
    factory(root._, root.Backbone, root);
  }

}(this, function(_, Backbone, root) {

  'use strict';

  // Try our best to ensure Backbone and Underscore are available.
  _ = _ === void 0 ? root._ : _;
  Backbone = Backbone === void 0 ? root.Backbone : Backbone;

  // Setup
  // -----

  // Bind any actions on a given `model`.
  var Do = Backbone.Do = function(model) {
    var actions = _.result(model, 'actions');

    _.each(actions, function(action, name) {
      if (!_.isUndefined(model[name])) throw new Error('Property already exists with action name: ' + name);

      model[name] = _.partial(Do.perform, model, name);
    });

    return Do;
  };

  // Default CRUD method used when none is specified.
  Do.defaultMethod = 'update';

  // Current version of the `Do` plugin.
  Do.VERSION = '0.1.4';

  // Helpers
  // -------

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;

    options.error = function(resp) {
      if (error) error(model, resp, options);

      model.trigger('error', model, resp, options);
    };
  };

  // Actions
  // -------

  // Extract and parse any attributes declared on a given object.
  var getAttributes = function(obj) {
    var attrs = _.result(obj, 'attrs');

    if (_.isString(attrs)) attrs = attrs.split(/\s+/);

    return attrs || [];
  };

  // Merge the options specified for a specific action invocation with it's default options.
  Do.getOptions = function(model, action, name, data, options) {
    options = _.extend({ validate: true }, action, options);

    options.method = _.result(options, 'method') || Do.defaultMethod;

    // Build the URL to which the request will be sent when the action is invoked.
    // If the `action` has no URL specified, `parseName` is called to derive the path based on the action's `name`.
    var base = _.result(model, 'url');
    var path = _.result(options, 'url') || Do.parseName(name);
    var separator = base[base.length - 1] === '/' ? '' : '/';

    options.url = base + separator + path;

    // The contents request to the server will either be a key-value map of the specified attributes, if any, or the
    // merged `data` from the `action` and the current `options`.
    data = _.isFunction(data) ? data.call(model) : data;
    data = _.extend({}, _.result(action, 'data'), data);

    // If no `data` was provided, merge attributes defined on the `action` as well as any on current `options`.
    if (_.isEmpty(data)) data = model.pick(_.union(getAttributes(action), getAttributes(options)));

    options.data = _.isEmpty(data) ? null : data;

    return options;
  };

  // Allow users to change how actions with no `url` specified have their URL path derived by overriding this function
  // which, by default, simply returns the value of it's only parameter.
  Do.parseName = function(name) {
    return name;
  };

  // Sync the `model` to the server based on the action with the given `name`.
  // If the server returns an attributes hash that differs, the model's state will be `set` again.
  Do.perform = function(model, name, data, options) {
    var action = model.actions[name];
    action = _.isFunction(action) ? action.call(model) : action;

    options = Do.getOptions(model, action, name, data, options);

    var method = options.method;
    var attributes = model.attributes;

    // Try to normalise the options to reduce possible conflicts.
    options = _.omit(options, 'attrs', 'method');

    if (_.isUndefined(options.parse)) options.parse = true;

    // TODO: comment
    if (options.data != null && (method === 'create' || method === 'update' || method === 'patch')) {
      options.attrs = options.data;

      delete options.data;
    }

    // After a successful server-side action, the client is (optionally) updated with the server-side state.
    var success = options.success;

    options.success = function(resp) {
      // Ensure that the model's attributes are restored during synchronous actions.
      model.attributes = attributes;

      var serverAttrs = model.parse(resp, options);

      if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) return false;

      if (success) success(model, resp, options);

      model.trigger('action:' + name, model, resp, options);
      model.trigger('action', model, name, resp, options);
    };

    wrapError(model, options);

    // Use the logic within `Backbone.sync` to our advantage.
    return model.sync(method, model, options);
  };

}));