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

  // Bind any actions on a given `model`.
  var Do = Backbone.Do = function(model) {
    var actions = _.result(model, 'actions');
    _.each(actions, function (action, name) {
      model[name] = function (options) {
        return Do.perform(model, action, name, options);
      };
    });

    return Do;
  };

  // Default HTTP method used when no/invalid method was specified.
  Do.defaultMethod = 'GET';

  // Current version of the `Do` plugin.
  Do.VERSION = '0.1.0alpha';

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

  // Extract and parse any attributes declared on a given object.
  function getAttributes(obj) {
    var attrs = _.result(obj, 'attrs');
    return _.isString(attrs) ? attrs.split(/\s+/) : attrs;
  }

  // Merge the options specified for a specific action invocation with it's default options.
  function getOptions(model, action, name, options) {
    options = _.extend({}, action.options, options);

    // Merge attributes defined on the `action` as well as any on current `options`.
    var attrs = _.union(getAttributes(action), getAttributes(options));
    // The contents request to the server will either be a key-value map of the specified
    // attributes, if any, or the merged `data` from the `action` and the current `options`.
    if (_.isEmpty(attrs)) {
      options.data = _.extend({}, _.result(action, 'data'), _.result(options, 'data'));
    } else {
      options.data = model.pick(attrs);
    }

    // Build the URL to which the request will be sent when the action is invoked.
    // If the `action` has no URL specified, `parseName` is called to derive the path based on the
    // action's `name`.
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

  // Allow users to change how actions with no `url` specified have their URL path derived by
  // overriding this function which, by default, simply returns the value of it's only parameter.
  Do.parseName = function(name) {
    return name;
  };

  // TODO: Document
  // Sync the `model` to the server based on the invoked `action`.
  // If the server returns an attributes hash that differs, the model's state will be `set` again.
  Do.perform = function(model, action, name, options) {
    options = getOptions(model, action, name, options);

    var attributes = model.attributes;

    // After a successful server-side action, the client is (optionally) updated with the
    // server-side state.
    if (_.isUndefined(options.parse)) options.parse = true;

    var success = options.success;
    options.success = function(resp) {
      // Ensure that the model's attributes are restored during synchronous actions.
      model.attributes = attributes;

      var serverAttrs = model.parse(resp, options);
      if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) return false;

      if (success) success(model, resp, options);
      model.trigger('action:' + name, model, resp, options);
      model.trigger('action', name, model, resp, options);
    };
    wrapError(model, options);

    // Reverse the method-type mapping that Backbone uses to determine what HTTP method is used for
    // the request, falling back on `defaultMethod` if required.
    var method = options.method && options.method.toUpperCase(),
        type   = typeMap[method] || typeMap[Do.defaultMethod];
    // Use the logic within `Backbone.sync` to our advantage.
    return model.sync(type, model, options);
  };

}));
