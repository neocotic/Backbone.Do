(function () {

  var TestModel = Backbone.Model.extend({
    urlRoot: '/test',

    actions: {
      camelCase: {},
      doAction: {
        url: 'action',
        attrs: 'number string'
      },
      doSameAction: {
        url: function () {
          return 'action';
        },
        attrs: function () {
          return [ 'number', 'string' ];
        }
      },
      doAnything: {},
      doDelete: {
        options: {
          method: 'DELETE'
        }
      },
      doGet: {
        options: {
          method: 'GET'
        }
      },
      doPatch: {
        options: {
          method: 'PATCH'
        }
      },
      doPost: {
        options: {
          method: 'POST'
        }
      },
      doPut: {
        options: {
          method: 'PUT'
        }
      },
      doSomethingWeird: {
        options: {
          method: 'WEIRD'
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

  function ajax(settings, success) {
    var xhr = new XMLHttpRequest();
    xhr.open(settings.method, settings.url, true);
    xhr.onreadystatechange = function () {
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
  }

  test('Do enables actions', 1, function () {
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

  test('no Do no actions', 1, function () {
    var Model = Backbone.Model.extend({
      actions: {
        someAction: {}
      }
    });

    var model = new Model();
    ok(!model.someAction);
  });

  asyncTest('version is correct', 1, function () {
    ajax({ method: 'GET', url: '../package.json' }, function (resp) {
      var pkg = JSON.parse(resp);
      equal(Backbone.Do.VERSION, pkg.version);
      start();
    });
  });

  test('pick attributes to be sent as data and have custom URLs', 5, function () {
    doc.doAction({
      attrs: 'flag'
    });

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'read');
    equal(this.ajaxSettings.type, 'GET');
    equal(this.ajaxSettings.url, '/test/test1/action');
    deepEqual(this.ajaxSettings.data, doc.pick('number', 'string', 'flag'));
  });

  test('pick attributes to be sent as data and have custom URLs using functions', 5, function () {
    doc.doSameAction({
      attrs: function () {
        return [ 'flag' ];
      }
    });

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'read');
    equal(this.ajaxSettings.type, 'GET');
    equal(this.ajaxSettings.url, '/test/test1/action');
    deepEqual(this.ajaxSettings.data, doc.pick('number', 'string', 'flag'));
  });

  test('name is parsed to build URL', 1, function () {
    var oldParse = Backbone.Do.parseName;
    Backbone.Do.parseName = function(name) {
      return name.replace(/[A-Z]/g, function (letter) {
        return '-' + letter.toLowerCase();
      });
    };

    doc.camelCase();

    equal(this.ajaxSettings.url, '/test/test1/camel-case');

    Backbone.Do.parseName = oldParse;
  });

  test('perform triggers error event when an error occurs', 1, function () {
    doc.on('error', function () {
      ok(true);
    });
    doc.sync = function(method, model, options) {
      options.error();
    };
    doc.doAnything();
  });

  test('DELETE is a valid method action', 4, function () {
    doc.doDelete();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'delete');
    equal(this.ajaxSettings.type, 'DELETE');
    equal(this.ajaxSettings.url, '/test/test1/doDelete');
  });

  test('GET is a valid method action', 4, function () {
    doc.doGet();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'read');
    equal(this.ajaxSettings.type, 'GET');
    equal(this.ajaxSettings.url, '/test/test1/doGet');
  });

  test('GET is used as default action if none was specified', 4, function () {
    doc.doAnything();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'read');
    equal(this.ajaxSettings.type, 'GET');
    equal(this.ajaxSettings.url, '/test/test1/doAnything');
  });

  test('GET is used as default action if invalid method was specified', 4, function () {
    doc.doSomethingWeird();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'read');
    equal(this.ajaxSettings.type, 'GET');
    equal(this.ajaxSettings.url, '/test/test1/doSomethingWeird');
  });

  test('PATCH is a valid method action', 4, function () {
    doc.doPatch();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'patch');
    equal(this.ajaxSettings.type, 'PATCH');
    equal(this.ajaxSettings.url, '/test/test1/doPatch');
  });

  test('POST is a valid method action', 4, function () {
    doc.doPost();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'create');
    equal(this.ajaxSettings.type, 'POST');
    equal(this.ajaxSettings.url, '/test/test1/doPost');
  });

  test('PUT is a valid method action', 4, function () {
    doc.doPut();

    strictEqual(this.syncArgs.model, doc);
    equal(this.syncArgs.method, 'update');
    equal(this.ajaxSettings.type, 'PUT');
    equal(this.ajaxSettings.url, '/test/test1/doPut');
  });

}).call(this);
