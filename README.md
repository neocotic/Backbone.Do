     ____                     __      __                                  ____
    /\  _`\                  /\ \    /\ \                                /\  _`\
    \ \ \L\ \     __      ___\ \ \/'\\ \ \____    ___     ___      __    \ \ \/\ \    ___
     \ \  _ <'  /'__`\   /'___\ \ , < \ \ '__`\  / __`\ /' _ `\  /'__`\   \ \ \ \ \  / __`\
      \ \ \L\ \/\ \L\.\_/\ \__/\ \ \\`\\ \ \L\ \/\ \L\ \/\ \/\ \/\  __/  __\ \ \_\ \/\ \L\ \
       \ \____/\ \__/.\_\ \____\\ \_\ \_\ \_,__/\ \____/\ \_\ \_\ \____\/\_\\ \____/\ \____/
        \/___/  \/__/\/_/\/____/ \/_/\/_/\/___/  \/___/  \/_/\/_/\/____/\/_/ \/___/  \/___/

[Backbone.Do][] is a plugin to make model actions doable.

[![Build Status](https://secure.travis-ci.org/neocotic/Backbone.Do.png)](http://travis-ci.org/neocotic/Backbone.Do)

It can be used normally in any browser as well as in the [node.js][] environment.

# Important

This [Backbone][] plugin is still in development as is not yet complete. Please check again in the
near future.

The majority of work remaining involves completing the unit tests and the documentation.

## Install

Install using the package manager for your desired environment(s):

``` bash
# for node.js:
$ npm install backbone.do
# OR; for the browser:
$ bower install backbone.do
```

## Example

``` javascript
var Book = Backbone.Model.extend({

  urlRoot: '/books',

  actions: {
    buy: {
      options: {
        method: 'POST'
      }
    },

    getPages: {
      url:   'pages',
      attrs: 'pageCount'
    }
  },

  initialize: function() {
    Backbone.Do(this);
  }

});

var hobbit = new Book({
  id:        'hobbit,
  title:     'The Hobbit',
  pageCount: 310
});

hobbit.buy().then(function () {
  hobbit.getPages();
});
```

## Actions

TODO: Complete section

## Miscellaneous

### `defaultMethod`

The default HTTP method used by requests that don't specify one. This can be any of the following
methods;

- DELETE
- GET *(default)*
- PATCH
- POST
- PUT

``` javascript
Backbone.Do.defaultMethod = 'POST';
```

### `parseName(name)`

If an action doesn't specify a `url`, this function will be called to derive a path from it's name.

By default, it simply returns the `name` with no modifications, but this allows you to customize
this behaviour. For example; if you wanted actions with names in camel case to instead use hypens
you could use something like the following;

``` javascript
Backbone.Do.parseName = function(name) {
  return name.replace(/[A-Z]+/g, function (str) {
    return '-' + str.toLowerCase();
  });
};
```

### `VERSION`

The current version of `Do`.

``` javascript
Backbone.Do.VERSION;
```

## Bugs

If you have any problems with this library or would like to see the changes currently in
development you can do so here;

https://github.com/neocotic/Backbone.Do/issues

## Questions?

Take a look at `docs/*` to get a better understanding of what the code is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please visit the project's
homepage;

http://neocotic.com/Backbone.Do

[@neocotic]: https://twitter.com/neocotic
[backbone]: http://backbonejs.org
[backbone.do]: http://neocotic.com/Backbone.Do
[node.js]: http://nodejs.org
