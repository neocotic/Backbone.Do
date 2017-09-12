// Copyright (C) 2017 Alasdair Mercer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function() {

  'use strict';

  var ajax = Backbone.ajax;
  var sync = Backbone.sync;
  var defaultMethod = Backbone.Do.defaultMethod;
  var parseName = Backbone.Do.parseName;

  QUnit.testStart(function() {
    var env = QUnit.config.current.testEnvironment;

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

  QUnit.testDone(function() {
    Backbone.ajax = ajax;
    Backbone.sync = sync;
    Backbone.Do.defaultMethod = defaultMethod;
    Backbone.Do.parseName = parseName;
  });

})();
