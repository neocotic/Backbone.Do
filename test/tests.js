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
    ok(model.someAction);
  });

  test('no Do no actions', 1, function() {
    var Model = Backbone.Model.extend({
      actions: {
        someAction: {}
      }
    });

    var model = new Model();
    ok(!model.someAction);
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
    }, Error);
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
    ok(model.someAction);
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
    ok(model.someAction);
    ok(model.otherAction);
  });

  asyncTest('version matches bower', 1, function() {
    ajax({ method: 'GET', url: '../bower.json' }, function(resp) {
      var bwr = JSON.parse(resp);
      equal(Backbone.Do.VERSION, bwr.version);
      start();
    });
  });

  asyncTest('version matches npm', 1, function() {
    ajax({ method: 'GET', url: '../package.json' }, function(resp) {
      var pkg = JSON.parse(resp);
      equal(Backbone.Do.VERSION, pkg.version);
      start();
    });
  });

  test('known configurations can be functions (excl. attrs)', 5, function() {
    doc.doComplexWithData();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'create');
    equal(this.ajaxSettings.type, 'POST');
    equal(this.ajaxSettings.url, '/test/test1/complex-data');
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }));
  });

  test('known configurations can be functions (excl. data)', 5, function() {
    doc.doComplexWithAttrs();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'update');
    equal(this.ajaxSettings.type, 'PUT');
    equal(this.ajaxSettings.url, '/test/test1/complex-attrs');
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')));
  });

  test('actions can use a custom URL path', 4, function() {
    doc.doAction();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'update');
    equal(this.ajaxSettings.type, 'PUT');
    equal(this.ajaxSettings.url, '/test/test1/action');
  });

  test('custom URL paths are not encoded', 4, function() {
    var path = 'abcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()=+-_ `|\\,<.>/?;:\'@#~[{]}';
    doc.doAction(null, { url: path });

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'update');
    equal(this.ajaxSettings.type, 'PUT');
    equal(this.ajaxSettings.url, '/test/test1/' + path);
  });

  test('pick attributes as string can be sent as data', 2, function() {
    doc.doAction();

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')));
  });

  test('pick attributes in array can be sent as data', 2, function() {
    doc.doSameAction();

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string')));
  });

  test('merged pick attributes as strings can be sent as data', 2, function() {
    doc.doAction(null, { attrs: 'flag' });

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')));
  });

  test('merged pick attributes in arrays can be sent as data', 2, function() {
    doc.doAction(null, { attrs: [ 'flag' ] });

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.data, JSON.stringify(doc.pick('number', 'string', 'flag')));
  });

  test('data has priority over pick attributes', 2, function() {
    var data = { foo: 'bar' };
    doc.doAction(data);

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.data, JSON.stringify(data));
  });

  test('data can be sent', 2, function() {
    doc.doActionWithData();

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.data, JSON.stringify({ foo: 'bar' }));
  });

  test('merge data to be sent', 2, function() {
    var data = { fu: 'baz' };
    doc.doActionWithData(data);

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.data, JSON.stringify(_.extend({ foo: 'bar' }, data)));
  });

  test('data is not stringified for read methods', 2, function() {
    var data = { foo: 'bar' };
    doc.doRead(data);

    strictEqual(this.syncArgs.model, doc);
    deepEqual(this.ajaxSettings.data, data);
  });

  test('content type is correct', 2, function() {
    doc.doAnything();

    strictEqual(this.syncArgs.model, doc);
    equal(this.ajaxSettings.contentType, 'application/json');
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

    equal(lastError, errorMessage);
    equal(doc.validationError, errorMessage);
  });

  test('set after action', 2, function() {
    this.successArgs = [ { testing: true } ];

    doc.doAction();

    strictEqual(this.syncArgs.model, doc);
    strictEqual(this.syncArgs.model.get('testing'), true);
  });

  test('action events are triggered', 7, function() {
    var mockResp = { mock: true };
    this.successArgs = [ mockResp ];

    doc.on('action:doAction', function(model, resp, options) {
      strictEqual(model, doc);
      strictEqual(resp, mockResp);
      ok(options);
    });
    doc.on('action', function(model, name, resp, options) {
      strictEqual(model, doc);
      equal(name, 'doAction');
      strictEqual(resp, mockResp);
      ok(options);
    });

    doc.doAction();
  });

  test('name is parsed to build URL', 2, function() {
    var oldParse = Backbone.Do.parseName;
    Backbone.Do.parseName = function(name) {
      ok(true);
      return name;
    };

    doc.doAnything();

    equal(this.ajaxSettings.url, '/test/test1/doAnything');

    Backbone.Do.parseName = oldParse;
  });

  test('perform triggers error event when an error occurs', 1, function() {
    doc.on('error', function() {
      ok(true);
    });
    doc.sync = function(method, model, options) {
      options.error();
    };
    doc.doAnything();
  });

  test('delete is a valid method action', 4, function() {
    doc.doDelete();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'delete');
    equal(this.ajaxSettings.type, 'DELETE');
    equal(this.ajaxSettings.url, '/test/test1/doDelete');
  });

  test('read is a valid method action', 4, function() {
    doc.doRead();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'read');
    equal(this.ajaxSettings.type, 'GET');
    equal(this.ajaxSettings.url, '/test/test1/doRead');
  });

  test('patch is a valid method action', 4, function() {
    doc.doPatch();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'patch');
    equal(this.ajaxSettings.type, 'PATCH');
    equal(this.ajaxSettings.url, '/test/test1/doPatch');
  });

  test('create is a valid method action', 4, function() {
    doc.doCreate();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'create');
    equal(this.ajaxSettings.type, 'POST');
    equal(this.ajaxSettings.url, '/test/test1/doCreate');
  });

  test('update is a valid method action', 4, function() {
    doc.doUpdate();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'update');
    equal(this.ajaxSettings.type, 'PUT');
    equal(this.ajaxSettings.url, '/test/test1/doUpdate');
  });

  test('update is used as default action if none was specified', 4, function() {
    doc.doAnything();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'update');
    equal(this.ajaxSettings.type, 'PUT');
    equal(this.ajaxSettings.url, '/test/test1/doAnything');
  });

})();