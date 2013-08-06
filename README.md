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

## Install

Install using the package manager for your desired environment(s):

``` bash
# for node.js:
$ npm install backbone.do
# OR; for the browser:
$ bower install backbone.do
```

Obviously, this plugin depends on [Backbone][] along with its dependencies.

## API

### Actions

Giving your model actions is as simple as adding a new hash and calling this plugin in your model's
`initialize` function. `actions` can even be a function that returns a hash.

``` javascript
var Book = Backbone.Model.extend({
  urlRoot: '/books',

  actions: {
    buy: {
      method: 'POST'
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
```

Now the `Book` model has the 2 additional functions; `buy` and `getPages` which, when called, will
result in a request being sent to the server based on their options as well as any options passed
in. Each action function accepts optional options that can overload the default configurations for
that action.

``` javascript
var hobbit = new Book({
  id:        'hobbit',
  title:     'The Hobbit',
  author:    'J.R.R. Tolkien',
  genre:     'fantasy',
  keywords:  [ 'baggins', 'shire' ],
  pageCount: 310
});

hobbit.buy().then(function () {
  hobbit.getPages();
});
```

If the server returns an attribute hash, those values will then be applied to the model. In the
previous example the following requests would have been sent to the server:

```
POST http://example.com/books/hobbit/buy
GET  http://example.com/books/hobbit/pages
```

The second request would have been sent `pageCount` key-value pair from the model in the request
body.

There's a lot of ways in which actions can be declared so let's go over the different
configurations. Each configuration can also be a function that returns the value to be used and all
are entirely optional. Even the whole action can be a function that returns the configuration hash.

Any other undocumented configurations will simply be passed along to [Backbone.sync][] and,
eventually, [Backbone.ajax][] as options. Action functions also support the same asynchronous
patterns as [Backbone.ajax][], whose result is also used as their return value.

#### `attrs`

Type(s): `String` `String[]`

A subset of attributes to be picked from the model and sent to the server.

**Note:** If `attrs` is used, the resulting attributes hash will replace the `data` configuration.

``` javascript
var Book = Backbone.Model.extend({
  // ...

  actions: {
    // ...

    findRelated: {
      attrs: 'author genre keywords'
    }
  },

  defaults: function() {
    return { related: [] };
  },

  // ...
});
```

#### `data`

Type(s): `Object`

JSON-ifiable value that is to be sent to the server in the request body.

**Note:** If the `attrs` configuration is used, this will be replaced by the resulting attributes
hash.

``` javascript
var Book = Backbone.Model.extend({
  // ...

  actions: {
    // ...

    loan: {
      data: {
        user: 'golem2013'
      }
    }
  },

  // ...
});
```

#### `method`

Type(s): `String`

The HTTP method to be used in the request that is sent to the server. By default this is the value
of [defaultMethod](#defaultmethod). This can be any of the following methods;

- `DELETE`
- `GET`
- `PATCH`
- `POST`
- `PUT`

#### `url`

Type(s): `String`

The path to be appended to URL of the model, which is used as the target of the server request. If
this is not specified, the [parseName](#parsenamename) function will be called instead to derive
an appropriate path based on the action's name.

### Miscellaneous

#### `defaultMethod`

The default HTTP method used by requests that don't specify one. This can be any of the same values
for the [method](#method) configuration but, by default, is `GET`.

``` javascript
Backbone.Do.defaultMethod = 'POST';
```

#### `parseName(name)`

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

#### `VERSION`

The current version of this plugin.

``` javascript
Backbone.Do.VERSION;
```

## Events

Two different events will be trigger by this plugin:

- **action** (model, name, resp, options) - when a model's action has successfully completed
- **action:[name]** (model resp, options) - when a specific action has successfully completed

## Bugs

If you have any problems with this library or would like to see the changes currently in
development you can do so here;

https://github.com/neocotic/Backbone.Do/issues

## Questions?

Take a look at `docs/backbone.do.html` to get a better understanding of what the code is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please visit the project's
homepage;

http://neocotic.com/Backbone.Do

[@neocotic]: https://twitter.com/neocotic
[backbone]: http://backbonejs.org
[backbone.ajax]: http://backbonejs.org/#Sync-ajax
[backbone.do]: http://neocotic.com/Backbone.Do
[backbone.sync]: http://backbonejs.org/#Sync
[node.js]: http://nodejs.org
