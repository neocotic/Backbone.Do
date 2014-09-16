(function() {

  'use strict';

  var TestCollection = Backbone.Collection.extend({
    url: '/test',

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
  var docs;

  module('Backbone.Do', {
    setup: function() {
      doc = new TestModel({
        id:     'test1',
        number:  1,
        string: 'testing1',
        flag:   true
      });

      docs = new TestCollection([
        new Backbone.Model({
          id:     'test1',
          number:  1,
          string: 'testing1',
          flag:   true
        }),
        new Backbone.Model({
          id:     'test2',
          number:  2,
          string: 'testing2',
          flag:   false
        }),
        new Backbone.Model({
          id:     'test3',
          number:  3,
          string: 'testing3',
          flag:   true
        })
      ]);
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

  test('Do enables collection actions', 1, function() {
    var Collection = Backbone.Collection.extend({
      actions: {
        someAction: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    var collection = new Collection();

    ok(collection.someAction, 'actions should have been prepared');
  });

  test('Do enables model actions', 1, function() {
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

  test('no Do no collection actions', 1, function() {
    var Collection = Backbone.Collection.extend({
      actions: {
        someAction: {}
      }
    });

    var collection = new Collection();

    ok(!collection.someAction, 'actions should not have been prepared');
  });

  test('no Do no model actions', 1, function() {
    var Model = Backbone.Model.extend({
      actions: {
        someAction: {}
      }
    });

    var model = new Model();

    ok(!model.someAction, 'actions should not have been prepared');
  });

  test('action names must not already exist on Collection prototype', 1, function() {
    var collection;
    var Collection = Backbone.Collection.extend({
      actions: {
        remove: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    throws(function() {
      collection = new Collection();
    }, Error, 'should have thrown error when preparing action with existing name');
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

  test('collection actions can be a function', 1, function() {
    var Collection = Backbone.Collection.extend({
      actions: function() {
        return {
          someAction: {}
        };
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    var collection = new Collection();

    ok(collection.someAction, 'actions as a function should have been prepared');
  });

  test('model actions can be a function', 1, function() {
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

  test('individual collection actions can be functions', 2, function() {
    var Collection = Backbone.Collection.extend({
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

    var collection = new Collection();

    ok(collection.someAction, 'action as a function should have been prepared');
    ok(collection.otherAction, 'action should have been prepared');
  });

  test('individual model actions can be functions', 2, function() {
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

  test('known collection action configurations (incl. data) can be functions', 5, function() {
    docs.doComplexWithData();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'create', 'test collection action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }),
      'test collection stringified action data should have been sent');
    equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/complex-data', 'derived action URL should have been used by request');
  });

  test('known model action configurations (incl. data) can be functions', 5, function() {
    doc.doComplexWithData();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'create', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }),
      'test model stringified action data should have been sent');
    equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/complex-data', 'derived action URL should have been used by request');
  });

  test('known collection action configurations (incl. attrs) can be functions', 5, function() {
    docs.doComplexWithAttrs();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'update', 'test collection action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1' },
      { number: 2, string: 'testing2' },
      { number: 3, string: 'testing3' }
    ]), 'test collection stringified action data should have been sent');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/complex-attrs', 'derived action URL should have been used by request');
  });

  test('known model action configurations (incl. attrs) can be functions', 5, function() {
    doc.doComplexWithAttrs();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'test model stringified action data should have been sent');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/complex-attrs', 'derived action URL should have been used by request');
  });

  test('collection actions can use a custom URL path', 4, function() {
    docs.doAction();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/action',
      'derived test collection action URL should have been used by request');
  });

  test('model actions can use a custom URL path', 4, function() {
    doc.doAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/action',
      'derived test model action URL should have been used by request');
  });

  test('custom collection action URL paths are not encoded', 4, function() {
    var path = 'abcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()=+-_ `|\\,<.>/?;:\'@#~[{]}';
    docs.doAction(null, { url: path });

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/' + path, 'derived option action URL should have been used by request');
  });

  test('custom model action URL paths are not encoded', 4, function() {
    var path = 'abcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()=+-_ `|\\,<.>/?;:\'@#~[{]}';
    doc.doAction(null, { url: path });

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/' + path, 'derived option action URL should have been used by request');
  });

  test('pick collection attributes as string can be sent as data', 2, function() {
    docs.doAction();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1' },
      { number: 2, string: 'testing2' },
      { number: 3, string: 'testing3' }
    ]), 'action attributes should have been picked from test models and stringified before being sent');
  });

  test('pick model attributes as string can be sent as data', 2, function() {
    doc.doAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'action attributes should have been picked from test model and stringified before being sent');
  });

  test('pick collection attributes in array can be sent as data', 2, function() {
    docs.doSameAction();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1' },
      { number: 2, string: 'testing2' },
      { number: 3, string: 'testing3' }
    ]), 'action attributes should have been picked from test models and stringified before being sent');
  });

  test('pick model attributes in array can be sent as data', 2, function() {
    doc.doSameAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'action attributes should have been picked from test model and stringified before being sent');
  });

  test('merged pick collection attributes as strings can be sent as data', 2, function() {
    docs.doAction(null, { attrs: 'flag' });

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1', flag: true  },
      { number: 2, string: 'testing2', flag: false },
      { number: 3, string: 'testing3', flag: true  }
    ]), 'merged action attributes should have been picked from test models and stringified before being sent');
  });

  test('merged pick model attributes as strings can be sent as data', 2, function() {
    doc.doAction(null, { attrs: 'flag' });

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')),
      'merged action attributes should have been picked from test model and stringified before being sent');
  });

  test('merged pick collection attributes in arrays can be sent as data', 2, function() {
    docs.doAction(null, { attrs: [ 'flag' ] });

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1', flag: true  },
      { number: 2, string: 'testing2', flag: false },
      { number: 3, string: 'testing3', flag: true  }
    ]), 'merged action attributes should have been picked from test models and stringified before being sent');
  });

  test('merged pick model attributes in arrays can be sent as data', 2, function() {
    doc.doAction(null, { attrs: [ 'flag' ] });

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')),
      'merged action attributes should have been picked from test model and stringified before being sent');
  });

  test('data has priority over pick collection attributes', 2, function() {
    var data = { foo: 'bar' };
    docs.doAction(data);

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data),
      'action data should have been sent instead of selected attributes');
  });

  test('data has priority over pick model attributes', 2, function() {
    var data = { foo: 'bar' };
    doc.doAction(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data),
      'action data should have been sent instead of selected attributes');
  });

  test('data can be sent for collection', 3, function() {
    docs.doActionWithData();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }), 'test collection action data should have been sent');
  });

  test('data can be sent for model', 3, function() {
    doc.doActionWithData();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }), 'test model action data should have been sent');
  });

  test('merge data to be sent for collection', 3, function() {
    var data = { fu: 'baz' };
    docs.doActionWithData(data);

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
    equal(this.ajaxSettings.data, JSON.stringify(_.extend({ foo: 'bar' }, data)),
      'merged action data should have been sent');
  });

  test('merge data to be sent for model', 3, function() {
    var data = { fu: 'baz' };
    doc.doActionWithData(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
    equal(this.ajaxSettings.data, JSON.stringify(_.extend({ foo: 'bar' }, data)),
      'merged action data should have been sent');
  });

  test('content type is correct for collection', 2, function() {
    docs.doAnything();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
  });

  test('content type is correct for model', 2, function() {
    doc.doAnything();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.ajaxSettings.contentType, 'application/json', 'Backbone.sync should have set Content-Type header');
  });

  test('validate before setting on model', 2, function() {
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

  test('set after collection action', 5, function() {
    var mockResp = [ { id: 'test2', testing: true } ];
    this.successArgs = [ mockResp ];

    docs.doAction(null, { remove: false });

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    ok(!docs.get('test1').has('testing'), 'test model should not have been updated');
    ok(docs.get('test2').has('testing'), 'test model should have been updated');
    strictEqual(docs.get('test2').get('testing'), true, 'test model should have been updated with response');
    ok(!docs.get('test3').has('testing'), 'test model should not have been updated');
  });

  test('can reset after collection action', 3, function() {
    var mockResp = [ { id: 'test2', testing: true } ];
    this.successArgs = [ mockResp ];

    docs.on('reset', function() {
      ok(true, 'reset event should have been triggered');
    });

    docs.doAction(null, { reset: true });

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    deepEqual(this.syncArgs.model.toJSON(), mockResp, 'test collection should habe been reset with response');
  });

  test('set after model action', 2, function() {
    this.successArgs = [ { testing: true } ];

    doc.doAction();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    strictEqual(this.syncArgs.model.get('testing'), true, 'test model should have been updated with response');
  });

  test('collection action events are triggered', 7, function() {
    var mockResp = [ { id: 'test2', mock: true } ];
    this.successArgs = [ mockResp ];

    docs.on('action:doAction', function(collection, resp, options) {
      strictEqual(collection, docs, 'test collection should have been passed to event handler');
      strictEqual(resp, mockResp, 'response should have been passed to event handler');
      ok(options, 'options should have been passed to event handler');
    });
    docs.on('action', function(collection, name, resp, options) {
      strictEqual(collection, docs, 'test collection should have been passed to event handler');
      equal(name, 'doAction', 'action name should have been passed to event handler');
      strictEqual(resp, mockResp, 'response should have been passed to event handler');
      ok(options, 'options should have been passed to event handler');
    });

    docs.doAction();
  });

  test('model action events are triggered', 7, function() {
    var mockResp = { mock: true };
    this.successArgs = [ mockResp ];

    doc.on('action:doAction', function(model, resp, options) {
      strictEqual(model, doc, 'test model should have been passed to event handler');
      strictEqual(resp, mockResp, 'response should have been passed to event handler');
      ok(options, 'options should have been passed to event handler');
    });
    doc.on('action', function(model, name, resp, options) {
      strictEqual(model, doc, 'test model should have been passed to event handler');
      equal(name, 'doAction', 'action name should have been passed to event handler');
      strictEqual(resp, mockResp, 'response should have been passed to event handler');
      ok(options, 'options should have been passed to event handler');
    });

    doc.doAction();
  });

  test('collection action name is parsed to build URL', 1, function() {
    Backbone.Do.parseName = function() {
      return 'foo';
    };

    docs.doAnything();

    equal(this.ajaxSettings.url, '/test/foo', 'parseName should have been used');
  });

  test('model action name is parsed to build URL', 1, function() {
    Backbone.Do.parseName = function() {
      return 'foo';
    };

    doc.doAnything();

    equal(this.ajaxSettings.url, '/test/test1/foo', 'parseName should have been used');
  });

  test('perform triggers error event when an error occurs on a collection', 1, function() {
    docs.on('error', function() {
      ok(true, 'error event should have been triggered');
    });

    docs.sync = function(method, model, options) {
      options.error();
    };

    docs.doAnything();
  });

  test('perform triggers error event when an error occurs on a model', 1, function() {
    doc.on('error', function() {
      ok(true, 'error event should have been triggered');
    });

    doc.sync = function(method, model, options) {
      options.error();
    };

    doc.doAnything();
  });

  test('delete is a valid method action for collections and data is not stringified', 5, function() {
    var data = { foo: 'bar' };
    docs.doDelete(data);

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'delete', 'test collection action method should have been used');
    deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    equal(this.ajaxSettings.type, 'DELETE',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/doDelete', 'derived action URL should have been used by request');
  });

  test('delete is a valid method action for models and data is not stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doDelete(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'delete', 'test model action method should have been used');
    deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    equal(this.ajaxSettings.type, 'DELETE',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doDelete', 'derived action URL should have been used by request');
  });

  test('read is a valid method action for collections and data is not stringified', 5, function() {
    var data = { foo: 'bar' };
    docs.doRead(data);

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'read', 'test collection action method should have been used');
    deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    equal(this.ajaxSettings.type, 'GET', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/doRead', 'derived action URL should have been used by request');
  });

  test('read is a valid method action for models and data is not stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doRead(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'read', 'test model action method should have been used');
    deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    equal(this.ajaxSettings.type, 'GET', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doRead', 'derived action URL should have been used by request');
  });

  test('patch is a valid method action for collections and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    docs.doPatch(data);

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'patch', 'test collection action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'PATCH',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/doPatch', 'derived action URL should have been used by request');
  });

  test('patch is a valid method action for models and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doPatch(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'patch', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'PATCH',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doPatch', 'derived action URL should have been used by request');
  });

  test('create is a valid method action for collections and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    docs.doCreate(data);

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'create', 'test collection action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/doCreate', 'derived action URL should have been used by request');
  });

  test('create is a valid method action for models and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doCreate(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'create', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doCreate', 'derived action URL should have been used by request');
  });

  test('update is a valid method action for collections and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    docs.doUpdate(data);

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'update', 'test collection action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/doUpdate', 'derived action URL should have been used by request');
  });

  test('update is a valid method action for models and data is stringified', 5, function() {
    var data = { foo: 'bar' };
    doc.doUpdate(data);

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'test model action method should have been used');
    equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doUpdate', 'derived action URL should have been used by request');
  });

  test('update is used as default action for collections if none was specified', 4, function() {
    docs.doAnything();

    strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    equal(this.syncArgs.method, 'update', 'default action method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/doAnything', 'derived action URL should have been used by request');
  });

  test('update is used as default action for models if none was specified', 4, function() {
    doc.doAnything();

    strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    equal(this.syncArgs.method, 'update', 'default action method should have been used');
    equal(this.ajaxSettings.type, 'PUT', 'corresponding HTTP method for CRUD method should have been used by request');
    equal(this.ajaxSettings.url, '/test/test1/doAnything', 'derived action URL should have been used by request');
  });

})();