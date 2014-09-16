     ____                     __      __                                  ____
    /\  _`\                  /\ \    /\ \                                /\  _`\
    \ \ \L\ \     __      ___\ \ \/'\\ \ \____    ___     ___      __    \ \ \/\ \    ___
     \ \  _ <'  /'__`\   /'___\ \ , < \ \ '__`\  / __`\ /' _ `\  /'__`\   \ \ \ \ \  / __`\
      \ \ \L\ \/\ \L\.\_/\ \__/\ \ \\`\\ \ \L\ \/\ \L\ \/\ \/\ \/\  __/  __\ \ \_\ \/\ \L\ \
       \ \____/\ \__/.\_\ \____\\ \_\ \_\ \_,__/\ \____/\ \_\ \_\ \____\/\_\\ \____/\ \____/
        \/___/  \/__/\/_/\/____/ \/_/\/_/\/___/  \/___/  \/_/\/_/\/____/\/_/ \/___/  \/___/

[Backbone.Do][0] is a plugin to make model actions doable.

[![Build Status](https://travis-ci.org/neocotic/Backbone.Do.svg?branch=develop)][4]

It can be used normally in any browser as well as in the [node.js][6] environment.

## Install

Install using the package manager for your desired environment(s):

``` bash
# for node.js:
$ npm install backbone.do
# OR; for the browser:
$ bower install backbone.do
```

Obviously, this plugin depends on [Backbone][1] along with its dependencies.

## API

### Actions

Giving your model actions is as simple as adding a new hash and calling this plugin in your model's `initialize`
function. `actions` can even be a function that returns a hash.

``` javascript
var Book = Backbone.Model.extend({
  urlRoot: '/books',

  actions: {
    buy: {
      data: {
        referrer: 'Amazon',
        method:   'create'
      }
    },

    getPages: {
      url:    'pages',
      attrs:  'pageCount',
      method: 'read'
    }
  },

  initialize: function() {
    Backbone.Do(this);
  }
});
```

Now the `Book` model has the 2 additional functions; `buy` and `getPages` which, when called, will result in a request
being sent to the server based on their options as well as any data and/or options passed in.

``` javascript
var hobbit = new Book({
  id:        'hobbit',
  title:     'The Hobbit',
  author:    'J.R.R. Tolkien',
  genre:     'fantasy',
  keywords:  [ 'baggins', 'shire' ],
  pageCount: 310
});

hobbit.buy().then(function() {
  hobbit.getPages();
});
```

If the server returns an attribute hash, those values will then be applied to the model. In the previous example the
following requests would have been sent to the server:

```
POST http://example.com/books/hobbit/buy
GET  http://example.com/books/hobbit/pages?pageCount=310
```

The first request would have been sent the JSON-formatted data in the request body.

Each action function accepts optional data (to be sent to the server) and options (to configure the action) that can
overload the defaults for that action.

``` javascript
var ShoppingCart = Backbone.View.extend({
  events: {
    'click .checkout-btn': 'checkout'
  },

  checkout: function() {
    this.model.buy({
      quantity: this.$('input.quantity-field').val()
    });
  }
});
```

There's a lot of ways in which actions can be declared so let's go over the different configurations. Each
configuration can also be a function that returns the value to be used and all are entirely optional. Even the whole
action can be a function that returns the configuration hash.

Any other undocumented configurations will simply be passed along to [Backbone.sync][2] and, eventually,
[Backbone.ajax][3] as options. Action functions also support the same asynchronous patterns as [Backbone.ajax][3],
whose result is also used as their return value.

#### `attrs`

Type(s): `String` `String[]`

A subset of attributes to be picked from the model and sent to the server.

**Note:** If the `data` configuration is used, this will be ignored.

``` javascript
var Book = Backbone.Model.extend({
  // ...

  actions: {
    // ...

    findRelated: {
      attrs:  'author genre keywords',
      method: 'read'
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

**Note:** If the `attrs` configuration is used and no `data` is specified, the resulting attributes hash will replace
the populate this value.

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

The CRUD method to be passed to [Backbone.sync][2]. By default this is the value of [defaultMethod](#defaultmethod).
This can be any of the following methods;

- `create`
- `update`
- `patch`
- `delete`
- `read`

#### `url`

Type(s): `String`

The path to be appended to URL of the model, which is used as the target of the server request. If this is not
specified, the [parseName](#parsenamename) function will be called instead to derive an appropriate path based on the
action's name.

### Miscellaneous

#### `defaultMethod`

The default CRUD method used internally by Backbone. This can be any of the same values for the [method](#method)
configuration but, by default, is `update`.

``` javascript
Backbone.Do.defaultMethod = 'update';
```

#### `parseName(name)`

If an action doesn't specify a `url`, this function will be called to derive a path from it's name.

By default, it simply returns the `name` with no modifications, but this allows you to customize this behaviour. For
example; if you wanted actions with names in camel case to instead use hyphens you could use something like the
following;

``` javascript
Backbone.Do.parseName = function(name) {
  return name.replace(/[A-Z]+/g, function(str) {
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

If you have any problems with this library or would like to see the changes currently in development you can do so
here;

https://github.com/neocotic/Backbone.Do/issues

See the `CONTRIBUTING.md` document for more details.

## Questions?

Take a look at `docs/backbone.do.html` to get a better understanding of what the code is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][5].

However, if you want more information or examples of using this library please visit the project's homepage;

http://neocotic.com/Backbone.Do

[0]: http://neocotic.com/Backbone.Do
[1]: http://backbonejs.org
[2]: http://backbonejs.org/#Sync
[3]: http://backbonejs.org/#Sync-ajax
[4]: https://travis-ci.org/neocotic/Backbone.Do
[5]: https://twitter.com/neocotic
[6]: http://nodejs.org