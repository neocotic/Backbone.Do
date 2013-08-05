(function () {

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
      var xhr = sync.apply(this, arguments);
      if (env.successArgs) options.success.apply(this, env.successArgs);
      if (env.errorArgs) options.error.apply(this, env.errorArgs);
      return xhr;
    };
  });

  QUnit.testDone(function () {
    Backbone.ajax = ajax;
    Backbone.sync = sync;
    Backbone.Do.defaultMethod = defaultMethod;
  });

}).call(this);
