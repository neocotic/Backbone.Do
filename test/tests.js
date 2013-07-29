(function () {

  module('Backbone.Do');

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

  // TODO: Complete test suite

  test('can use actions after calling init', 2, function () {
    var Model = Backbone.Model.extend({
      actions: {
        someAction:    {},
        anotherAction: {}
      },
      initialize: function() {
        Backbone.Do.init(this);
      }
    });

    var model = new Model();
    ok(model.someAction);
    ok(model.anotherAction);
  });

  test('must call init to use actions', 2, function () {
    var Model = Backbone.Model.extend({
      actions: {
        someAction:    {},
        anotherAction: {}
      }
    });

    var model = new Model();
    ok(!model.someAction);
    ok(!model.anotherAction);
  });

  asyncTest('can get accurate version', 1, function () {
    ajax({ method: 'GET', url: '../package.json' }, function (resp) {
      var pkg = JSON.parse(resp);
      equal(Backbone.Do.VERSION, pkg.version);
      start();
    });
  });

}).call(this);