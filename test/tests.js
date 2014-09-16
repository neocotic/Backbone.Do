(function() {

  'use strict';

  var TestModel = Backbone.Model.extend({
    urlRoot: '/test',

    actions: {
      doAnything: {},
      doAction: {
        url: 'action',
        attrs: 'number string'
      },
      doSameAction: {
        url: 'action',
        attrs: [ 'number', 'string' ]
      },
      doActionWithData: {
        data: { foo: 'bar' }
      },
      doCreate:         { method: 'create' },
      doUpdate:         { method: 'update' },
      doPatch:          { method: 'patch'  },
      doDelete:         { method: 'delete' },
      doRead:           { method: 'read'   },
      doSomethingWeird: { method: 'weird'  },
      doComplexWithAttrs: {
        url: function() {
          return 'complex-attrs';
        },
        attrs: function() {
          return 'number string';
        },
        method: function() {
          return 'update';
        }
      },
      doComplexWithData: {
        url: function() {
          return 'complex-data';
        },
        data: function() {
          return { foo: 'bar' };
        },
        method: function() {
          return 'create';
        }
      }
    },

    initialize: function() {
      Backbone.Do(this);
    }
  });

  var doc;

  module('Backbone.Do', {
    setup: function() {
      doc = new TestModel({
        id:     'test1',
        number:  1,
        string: 'testing',
        flag:   true
      });
    }
  });

  var ajax = function(settings, success) {
    var xhr = new XMLHttpRequest();
    xhr.open(settings.method, settings.url, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(xhr.responseText);
        } else {
          throw new Error(xhr.responseText || 'Error with AJAX request');
        }
      }
    };

    xhr.send(settings.data);

    return xhr;
  };

  test('Do enables actions', 1, function() {
    var Model = Backbone.Model.extend({
      actions: {
        someAction: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    var model = new Model();
    ok(model.someAction, 'actions should have been prepared');
  });

  test('no Do no actions', 1, function() {
    var Model = Backbone.Model.extend({
      actions: {
        someAction: {}
      }
    });

    var model = new Model();
    ok(!model.someAction, 'actions should not have been prepared');
  });

  test('action names must not already exist on Model prototype', 1, function() {
    var model;
    var Model = Backbone.Model.extend({
      actions: {
        destroy: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    throws(function() {
      model = new Model();
    }, Error, 'should have thrown error when preparing action with existing name');
  });

  test('actions can be a function', 1, function() {
    var Model = Backbone.Model.extend({
      actions: function() {
        return {
          someAction: {}
        };
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    var model = new Model();
    ok(model.someAction, 'actions as a function should have been prepared');
  });

  test('individual actions can be functions', 2, function() {
    var Model = Backbone.Model.extend({
      actions: {
        someAction: function() {
          return {};
        },
        otherAction: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    var model = new Model();
    ok(model.someAction, 'action as a function should have been prepared');
    ok(model.otherAction, 'action should have been prepared');
  });

  asyncTest('version matches bower', 1, function() {
    ajax({ method: 'GET', url: '../bower.json' }, function(resp) {
      var bwr = JSON.parse(resp);
      equal(Backbone.Do.VERSION, bwr.version, 'version should match bower.json');
      start();
    });
  });

  asyncTest('version matches npm', 1, function() {
    ajax({ method: 'GET', url: '../package.json' }, function(resp) {
      var pkg = JSON.parse(resp);
      equal(Backbone.Do.VERSION, pkg.version, 'version should match package.json');
      start();
    });
  });

  test('known configurations (incl. data) can be functions', 5, function() {
    doc.doComplexWithData();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'create', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }),
      'test model stringified action data should have been sent');
    equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/complex-data', 'derived action URL should have been used by request');
  });

  test('known configurations (incl. attrs) can be functions', 5, function() {
    doc.doComplexWithAttrs();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'test model stringified action data should have been sent');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/complex-attrs', 'derived action URL should have been used by request');
  });

  test('actions can use a custom URL path', 4, function() {
    doc.doAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/action',
      'derived test model action URL should have been used by request');
  });

  test('custom URL paths are not encoded', 4, function() {
    var path = 'abcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()=+-_ `|\\,<.>/?;:\'@#~[{]}';
    doc.doAction(null, { url: path });

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/' + path, 'derived option action URL should have been used by request');
  });

  test('pick attributes as string can be sent as data', 2, function() {
    doc.doAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'action attributes should have been picked from test model and stringified before being sent');
  });

  test('pick attributes in array can be sent as data', 2, function() {
    doc.doSameAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'action attributes should have been picked from test model and stringified before being sent');
  });

  test('merged pick attributes as strings can be sent as data', 2, function() {
    doc.doAction(null, { attrs: 'flag' });

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')),
      'merged action attributes should have been picked from test model and stringified before being sent');
  });

  test('merged pick attributes in arrays can be sent as data', 2, function() {
    doc.doAction(null, { attrs: [ 'flag' ] });

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')),
      'merged action attributes should have been picked from test model and stringified before being sent');
  });

  test('data has priority over pick attributes', 2, function() {
    var data = { foo: 'bar' };
    doc.doAction(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data),
      'action data should have been sent instead of selected attributes');
  });

  test('data can be sent', 3, function() {
    doc.doActionWithData();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }), 'test model action data should have been sent');
  });

  test('merge data to be sent', 3, function() {
    var data = { fu: 'baz' };
    doc.doActionWithData(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
    equal(this.ajaxSettings.data, JSON.stringify(_.extend({ foo: 'bar' }, data)),
      'merged action data should have been sent');
  });

  test('content type is correct', 2, function() {
    doc.doAnything();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
  });

  test('validate before set', 2, function() {
    var errorMessage = 'Invalid!';
    this.successArgs = [ { valid: false } ];

    doc.validate = function(attrs) {
      if (!attrs.valid) return errorMessage;
    };

    var lastError;
    doc.on('invalid', function(model, error) {
      lastError = error;
    });

    doc.doAction();

    equal(lastError, errorMessage, 'validation error should have been triggered');
    equal(doc.validationError, errorMessage, 'test model should have reference to the validation error');
  });

  test('set after action', 2, function() {
    this.successArgs = [ { testing: true } ];

    doc.doAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    strictEqual(this.syncArgs.model.get('testing'), true, 'test model should have been updated with response');
  });

  test('action events are triggered', 7, function() {
    var mockResp = { mock: true };
    this.successArgs = [ mockResp ];

    doc.on('action:doAction', function(model, resp, options) {
      strictEqual(model, doc, 'test model should have been passed to event handler');
      strictEqual(resp, mockResp, 'response should have been passed to event handler');
      ok(options, 'options should have been passed to event handler');
    });
    doc.on('action', function(model, name, resp, options) {
      strictEqual(model, doc, 'test model should have been passed to event handler');
      equal(name, 'doAction', 'response should have been passed to event handler');
      strictEqual(resp, mockResp);
      ok(options, 'options should have been passed to event handler');
    });

    doc.doAction();
  });

  test('name is parsed to build URL', 1, function() {
    Backbone.Do.parseName = function() {
      return 'foo';
    };

    doc.doAnything();

    equal(this.ajaxSettings.url, '/test/test1/foo', 'parseName should have been used');
  });

  test('perform triggers error event when an error occurs', 1, function() {
    doc.on('error', function() {
      ok(true, 'error event should have been triggered');
    });

    doc.sync = function(method, model, options) {
      options.error();
    };

    doc.doAnything();
  });

  test('delete is a valid method action and data is not stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doDelete(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'delete', 'test model action method should have been used');
    deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    equal(this.ajaxSettings.type, 'DELETE',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doDelete', 'derived action URL should have been used by request');
  });

  test('read is a valid method action and data is not stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doRead(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'read', 'test model action method should have been used');
    deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    equal(this.ajaxSettings.type, 'GET', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doRead', 'derived action URL should have been used by request');
  });

  test('patch is a valid method action and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doPatch(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'patch', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'PATCH',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doPatch', 'derived action URL should have been used by request');
  });

  test('create is a valid method action and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doCreate(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'create', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doCreate', 'derived action URL should have been used by request');
  });

  test('update is a valid method action and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doUpdate(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doUpdate', 'derived action URL should have been used by request');
  });

  test('update is used as default action if none was specified', 4, function() {
    doc.doAnything();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'default action method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doAnything', 'derived action URL should have been used by request');
  });

})();