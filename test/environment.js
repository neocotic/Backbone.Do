(function() {

  var ajax = Backbone.ajax,
      sync = Backbone.sync,
      defaultMethod = Backbone.Do.defaultMethod;

  QUnit.testStart(function () {
    var env = this.config.current.testEnvironment;

    // Capture `Backbone.ajax` settings for comparison.
    Backbone.ajax = function(settings) {
      env.ajaxSettings = settings;
    };

    // Capture `Backbone.sync` arguments for comparison.
    Backbone.sync = function(method, model, options) {
      env.syncArgs = {
        method:  method,
        model:   model,
        options: options
      };
      return sync.apply(this, arguments);
    };
  });

  QUnit.testDone(function () {
    Backbone.ajax = ajax;
    Backbone.sync = sync;
    Backbone.Do.defaultMethod = defaultMethod;
  });

}).call(this);