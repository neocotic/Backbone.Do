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

  QUnit.module('Backbone.Do', {
    beforeEach: function() {
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

  QUnit.test('Do enables collection actions', function(assert) {
    assert.expect(1);

    var Collection = Backbone.Collection.extend({
      actions: {
        someAction: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    var collection = new Collection();

    assert.ok(collection.someAction, 'actions should have been prepared');
  });

  QUnit.test('Do enables model actions', function(assert) {
    assert.expect(1);

    var Model = Backbone.Model.extend({
      actions: {
        someAction: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    var model = new Model();

    assert.ok(model.someAction, 'actions should have been prepared');
  });

  QUnit.test('no Do no collection actions', function(assert) {
    assert.expect(1);

    var Collection = Backbone.Collection.extend({
      actions: {
        someAction: {}
      }
    });

    var collection = new Collection();

    assert.ok(!collection.someAction, 'actions should not have been prepared');
  });

  QUnit.test('no Do no model actions', function(assert) {
    assert.expect(1);

    var Model = Backbone.Model.extend({
      actions: {
        someAction: {}
      }
    });

    var model = new Model();

    assert.ok(!model.someAction, 'actions should not have been prepared');
  });

  QUnit.test('action names must not already exist on Collection prototype', function(assert) {
    assert.expect(1);

    var collection;
    var Collection = Backbone.Collection.extend({
      actions: {
        remove: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    assert.throws(function() {
      collection = new Collection();
    }, Error, 'should have thrown error when preparing action with existing name');
  });

  QUnit.test('action names must not already exist on Model prototype', function(assert) {
    assert.expect(1);

    var model;
    var Model = Backbone.Model.extend({
      actions: {
        destroy: {}
      },
      initialize: function() {
        Backbone.Do(this);
      }
    });

    assert.throws(function() {
      model = new Model();
    }, Error, 'should have thrown error when preparing action with existing name');
  });

  QUnit.test('collection actions can be a function', function(assert) {
    assert.expect(1);

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

    assert.ok(collection.someAction, 'actions as a function should have been prepared');
  });

  QUnit.test('model actions can be a function', function(assert) {
    assert.expect(1);

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

    assert.ok(model.someAction, 'actions as a function should have been prepared');
  });

  QUnit.test('individual collection actions can be functions', function(assert) {
    assert.expect(2);

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

    assert.ok(collection.someAction, 'action as a function should have been prepared');
    assert.ok(collection.otherAction, 'action should have been prepared');
  });

  QUnit.test('individual model actions can be functions', function(assert) {
    assert.expect(2);

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

    assert.ok(model.someAction, 'action as a function should have been prepared');
    assert.ok(model.otherAction, 'action should have been prepared');
  });

  QUnit.test('version matches bower', function(assert) {
    assert.expect(1);

    var done = assert.async();

    ajax({ method: 'GET', url: '../bower.json' }, function(resp) {
      var bwr = JSON.parse(resp);
      assert.equal(Backbone.Do.VERSION, bwr.version, 'version should match bower.json');
      done();
    });
  });

  QUnit.test('version matches npm', function(assert) {
    assert.expect(1);

    var done = assert.async();

    ajax({ method: 'GET', url: '../package.json' }, function(resp) {
      var pkg = JSON.parse(resp);
      assert.equal(Backbone.Do.VERSION, pkg.version, 'version should match package.json');
      done();
    });
  });

  QUnit.test('known collection action configurations (incl. data) can be functions', function(assert) {
    assert.expect(5);

    docs.doComplexWithData();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'create', 'test collection action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }),
      'test collection stringified action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/complex-data', 'derived action URL should have been used by request');
  });

  QUnit.test('known model action configurations (incl. data) can be functions', function(assert) {
    assert.expect(5);

    doc.doComplexWithData();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'create', 'test model action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }),
      'test model stringified action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/complex-data',
      'derived action URL should have been used by request');
  });

  QUnit.test('known collection action configurations (incl. attrs) can be functions', function(assert) {
    assert.expect(5);

    docs.doComplexWithAttrs();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'update', 'test collection action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1' },
      { number: 2, string: 'testing2' },
      { number: 3, string: 'testing3' }
    ]), 'test collection stringified action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/complex-attrs', 'derived action URL should have been used by request');
  });

  QUnit.test('known model action configurations (incl. attrs) can be functions', function(assert) {
    assert.expect(5);

    doc.doComplexWithAttrs();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'update', 'test model action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'test model stringified action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/complex-attrs',
      'derived action URL should have been used by request');
  });

  QUnit.test('collection actions can use a custom URL path', function(assert) {
    assert.expect(4);

    docs.doAction();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/action',
      'derived test collection action URL should have been used by request');
  });

  QUnit.test('model actions can use a custom URL path', function(assert) {
    assert.expect(4);

    doc.doAction();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/action',
      'derived test model action URL should have been used by request');
  });

  QUnit.test('custom collection action URL paths are not encoded', function(assert) {
    assert.expect(4);

    var path = 'abcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()=+-_ `|\\,<.>/?;:\'@#~[{]}';
    docs.doAction(null, { url: path });

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/' + path, 'derived option action URL should have been used by request');
  });

  QUnit.test('custom model action URL paths are not encoded', function(assert) {
    assert.expect(4);

    var path = 'abcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()=+-_ `|\\,<.>/?;:\'@#~[{]}';
    doc.doAction(null, { url: path });

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'update', 'default CRUD method should have been used');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/' + path,
      'derived option action URL should have been used by request');
  });

  QUnit.test('pick collection attributes as string can be sent as data', function(assert) {
    assert.expect(2);

    docs.doAction();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1' },
      { number: 2, string: 'testing2' },
      { number: 3, string: 'testing3' }
    ]), 'action attributes should have been picked from test models and stringified before being sent');
  });

  QUnit.test('pick model attributes as string can be sent as data', function(assert) {
    assert.expect(2);

    doc.doAction();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'action attributes should have been picked from test model and stringified before being sent');
  });

  QUnit.test('pick collection attributes in array can be sent as data', function(assert) {
    assert.expect(2);

    docs.doSameAction();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1' },
      { number: 2, string: 'testing2' },
      { number: 3, string: 'testing3' }
    ]), 'action attributes should have been picked from test models and stringified before being sent');
  });

  QUnit.test('pick model attributes in array can be sent as data', function(assert) {
    assert.expect(2);

    doc.doSameAction();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')),
      'action attributes should have been picked from test model and stringified before being sent');
  });

  QUnit.test('merged pick collection attributes as strings can be sent as data', function(assert) {
    assert.expect(2);

    docs.doAction(null, { attrs: 'flag' });

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1', flag: true  },
      { number: 2, string: 'testing2', flag: false },
      { number: 3, string: 'testing3', flag: true  }
    ]), 'merged action attributes should have been picked from test models and stringified before being sent');
  });

  QUnit.test('merged pick model attributes as strings can be sent as data', function(assert) {
    assert.expect(2);

    doc.doAction(null, { attrs: 'flag' });

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')),
      'merged action attributes should have been picked from test model and stringified before being sent');
  });

  QUnit.test('merged pick collection attributes in arrays can be sent as data', function(assert) {
    assert.expect(2);

    docs.doAction(null, { attrs: [ 'flag' ] });

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify([
      { number: 1, string: 'testing1', flag: true  },
      { number: 2, string: 'testing2', flag: false },
      { number: 3, string: 'testing3', flag: true  }
    ]), 'merged action attributes should have been picked from test models and stringified before being sent');
  });

  QUnit.test('merged pick model attributes in arrays can be sent as data', function(assert) {
    assert.expect(2);

    doc.doAction(null, { attrs: [ 'flag' ] });

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')),
      'merged action attributes should have been picked from test model and stringified before being sent');
  });

  QUnit.test('data has priority over pick collection attributes', function(assert) {
    assert.expect(2);

    var data = { foo: 'bar' };
    docs.doAction(data);

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data),
      'action data should have been sent instead of selected attributes');
  });

  QUnit.test('data has priority over pick model attributes', function(assert) {
    assert.expect(2);

    var data = { foo: 'bar' };
    doc.doAction(data);

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data),
      'action data should have been sent instead of selected attributes');
  });

  QUnit.test('data can be sent for collection', function(assert) {
    assert.expect(3);

    docs.doActionWithData();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.contentType, 'application/json',
      'Backbone.sync should have set Content-Type header');
    assert.equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }),
      'test collection action data should have been sent');
  });

  QUnit.test('data can be sent for model', function(assert) {
    assert.expect(3);

    doc.doActionWithData();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.contentType, 'application/json',
      'Backbone.sync should have set Content-Type header');
    assert.equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }),
      'test model action data should have been sent');
  });

  QUnit.test('merge data to be sent for collection', function(assert) {
    assert.expect(3);

    var data = { fu: 'baz' };
    docs.doActionWithData(data);

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.contentType, 'application/json',
      'Backbone.sync should have set Content-Type header');
    assert.equal(this.ajaxSettings.data, JSON.stringify(_.extend({ foo: 'bar' }, data)),
      'merged action data should have been sent');
  });

  QUnit.test('merge data to be sent for model', function(assert) {
    assert.expect(3);

    var data = { fu: 'baz' };
    doc.doActionWithData(data);

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.contentType, 'application/json',
      'Backbone.sync should have set Content-Type header');
    assert.equal(this.ajaxSettings.data, JSON.stringify(_.extend({ foo: 'bar' }, data)),
      'merged action data should have been sent');
  });

  QUnit.test('content type is correct for collection', function(assert) {
    assert.expect(2);

    docs.doAnything();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.ajaxSettings.contentType, 'application/json',
      'Backbone.sync should have set Content-Type header');
  });

  QUnit.test('content type is correct for model', function(assert) {
    assert.expect(2);

    doc.doAnything();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.ajaxSettings.contentType, 'application/json',
      'Backbone.sync should have set Content-Type header');
  });

  QUnit.test('validate before setting on model', function(assert) {
    assert.expect(2);

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

    assert.equal(lastError, errorMessage, 'validation error should have been triggered');
    assert.equal(doc.validationError, errorMessage, 'test model should have reference to the validation error');
  });

  QUnit.test('set after collection action', function(assert) {
    assert.expect(5);

    var mockResp = [ { id: 'test2', testing: true } ];
    this.successArgs = [ mockResp ];

    docs.doAction(null, { remove: false });

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.ok(!docs.get('test1').has('testing'), 'test model should not have been updated');
    assert.ok(docs.get('test2').has('testing'), 'test model should have been updated');
    assert.strictEqual(docs.get('test2').get('testing'), true, 'test model should have been updated with response');
    assert.ok(!docs.get('test3').has('testing'), 'test model should not have been updated');
  });

  QUnit.test('can reset after collection action', function(assert) {
    assert.expect(3);

    var mockResp = [ { id: 'test2', testing: true } ];
    this.successArgs = [ mockResp ];

    docs.on('reset', function() {
      assert.ok(true, 'reset event should have been triggered');
    });

    docs.doAction(null, { reset: true });

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.deepEqual(this.syncArgs.model.toJSON(), mockResp, 'test collection should habe been reset with response');
  });

  QUnit.test('set after model action', function(assert) {
    assert.expect(2);

    this.successArgs = [ { testing: true } ];

    doc.doAction();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.strictEqual(this.syncArgs.model.get('testing'), true, 'test model should have been updated with response');
  });

  QUnit.test('collection action events are triggered', function(assert) {
    assert.expect(7);

    var mockResp = [ { id: 'test2', mock: true } ];
    this.successArgs = [ mockResp ];

    docs.on('action:doAction', function(collection, resp, options) {
      assert.strictEqual(collection, docs, 'test collection should have been passed to event handler');
      assert.strictEqual(resp, mockResp, 'response should have been passed to event handler');
      assert.ok(options, 'options should have been passed to event handler');
    });
    docs.on('action', function(collection, name, resp, options) {
      assert.strictEqual(collection, docs, 'test collection should have been passed to event handler');
      assert.equal(name, 'doAction', 'action name should have been passed to event handler');
      assert.strictEqual(resp, mockResp, 'response should have been passed to event handler');
      assert.ok(options, 'options should have been passed to event handler');
    });

    docs.doAction();
  });

  QUnit.test('model action events are triggered', function(assert) {
    assert.expect(7);

    var mockResp = { mock: true };
    this.successArgs = [ mockResp ];

    doc.on('action:doAction', function(model, resp, options) {
      assert.strictEqual(model, doc, 'test model should have been passed to event handler');
      assert.strictEqual(resp, mockResp, 'response should have been passed to event handler');
      assert.ok(options, 'options should have been passed to event handler');
    });
    doc.on('action', function(model, name, resp, options) {
      assert.strictEqual(model, doc, 'test model should have been passed to event handler');
      assert.equal(name, 'doAction', 'action name should have been passed to event handler');
      assert.strictEqual(resp, mockResp, 'response should have been passed to event handler');
      assert.ok(options, 'options should have been passed to event handler');
    });

    doc.doAction();
  });

  QUnit.test('collection action name is parsed to build URL', function(assert) {
    assert.expect(1);

    Backbone.Do.parseName = function() {
      return 'foo';
    };

    docs.doAnything();

    assert.equal(this.ajaxSettings.url, '/test/foo', 'parseName should have been used');
  });

  QUnit.test('model action name is parsed to build URL', function(assert) {
    assert.expect(1);

    Backbone.Do.parseName = function() {
      return 'foo';
    };

    doc.doAnything();

    assert.equal(this.ajaxSettings.url, '/test/test1/foo', 'parseName should have been used');
  });

  QUnit.test('perform triggers error event when an error occurs on a collection', function(assert) {
    assert.expect(1);

    docs.on('error', function() {
      assert.ok(true, 'error event should have been triggered');
    });

    docs.sync = function(method, model, options) {
      options.error();
    };

    docs.doAnything();
  });

  QUnit.test('perform triggers error event when an error occurs on a model', function(assert) {
    assert.expect(1);

    doc.on('error', function() {
      assert.ok(true, 'error event should have been triggered');
    });

    doc.sync = function(method, model, options) {
      options.error();
    };

    doc.doAnything();
  });

  QUnit.test('delete is a valid method action for collections and data is not stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    docs.doDelete(data);

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'delete', 'test collection action method should have been used');
    assert.deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'DELETE',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/doDelete', 'derived action URL should have been used by request');
  });

  QUnit.test('delete is a valid method action for models and data is not stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    doc.doDelete(data);

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'delete', 'test model action method should have been used');
    assert.deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'DELETE',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/doDelete', 'derived action URL should have been used by request');
  });

  QUnit.test('read is a valid method action for collections and data is not stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    docs.doRead(data);

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'read', 'test collection action method should have been used');
    assert.deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'GET',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/doRead', 'derived action URL should have been used by request');
  });

  QUnit.test('read is a valid method action for models and data is not stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    doc.doRead(data);

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'read', 'test model action method should have been used');
    assert.deepEqual(this.ajaxSettings.data, data, 'option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'GET',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/doRead', 'derived action URL should have been used by request');
  });

  QUnit.test('patch is a valid method action for collections and data is stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    docs.doPatch(data);

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'patch', 'test collection action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'PATCH',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/doPatch', 'derived action URL should have been used by request');
  });

  QUnit.test('patch is a valid method action for models and data is stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    doc.doPatch(data);

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'patch', 'test model action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'PATCH',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/doPatch', 'derived action URL should have been used by request');
  });

  QUnit.test('create is a valid method action for collections and data is stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    docs.doCreate(data);

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'create', 'test collection action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/doCreate', 'derived action URL should have been used by request');
  });

  QUnit.test('create is a valid method action for models and data is stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    doc.doCreate(data);

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'create', 'test model action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'POST',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/doCreate', 'derived action URL should have been used by request');
  });

  QUnit.test('update is a valid method action for collections and data is stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    docs.doUpdate(data);

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'update', 'test collection action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/doUpdate', 'derived action URL should have been used by request');
  });

  QUnit.test('update is a valid method action for models and data is stringified', function(assert) {
    assert.expect(5);

    var data = { foo: 'bar' };
    doc.doUpdate(data);

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'update', 'test model action method should have been used');
    assert.equal(this.ajaxSettings.data, JSON.stringify(data), 'stringified option action data should have been sent');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/doUpdate', 'derived action URL should have been used by request');
  });

  QUnit.test('update is used as default action for collections if none was specified', function(assert) {
    assert.expect(4);

    docs.doAnything();

    assert.strictEqual(this.syncArgs.model, docs, 'test collection should have been used');
    assert.equal(this.syncArgs.method, 'update', 'default action method should have been used');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/doAnything', 'derived action URL should have been used by request');
  });

  QUnit.test('update is used as default action for models if none was specified', function(assert) {
    assert.expect(4);

    doc.doAnything();

    assert.strictEqual(this.syncArgs.model, doc, 'test model should have been used');
    assert.equal(this.syncArgs.method, 'update', 'default action method should have been used');
    assert.equal(this.ajaxSettings.type, 'PUT',
      'corresponding HTTP method for CRUD method should have been used by request');
    assert.equal(this.ajaxSettings.url, '/test/test1/doAnything',
      'derived action URL should have been used by request');
  });

})();
