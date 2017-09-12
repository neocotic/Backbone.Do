    888888b.                     888      888                                    8888888b.
    888  "88b                    888      888                                    888  "Y88b
    888  .88P                    888      888                                    888    888
    8888888K.   8888b.   .d8888b 888  888 88888b.   .d88b.  88888b.   .d88b.     888    888  .d88b.
    888  "Y88b     "88b d88P"    888 .88P 888 "88b d88""88b 888 "88b d8P  Y8b    888    888 d88""88b
    888    888 .d888888 888      888888K  888  888 888  888 888  888 88888888    888    888 888  888
    888   d88P 888  888 Y88b.    888 "88b 888 d88P Y88..88P 888  888 Y8b.    d8b 888  .d88P Y88..88P
    8888888P"  "Y888888  "Y8888P 888  888 88888P"   "Y88P"  888  888  "Y8888 Y8P 8888888P"   "Y88P"

[Backbone.Do](https://github.com/neocotic/Backbone.Do) is a [Backbone](http://backbonejs.org) plugin that makes model
actions doable.

[![Build Status](https://img.shields.io/travis/neocotic/Backbone.Do/develop.svg?style=flat-square)](https://travis-ci.org/neocotic/Backbone.Do)
[![Dependency Status](https://img.shields.io/david/neocotic/Backbone.Do.svg?style=flat-square)](https://david-dm.org/neocotic/Backbone.Do)
[![Dev Dependency Status](https://img.shields.io/david/dev/neocotic/Backbone.Do.svg?style=flat-square)](https://david-dm.org/neocotic/Backbone.Do?type=dev)
[![License](https://img.shields.io/npm/l/backbone.do.svg?style=flat-square)](https://github.com/neocotic/Backbone.Do/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/backbone.do.svg?style=flat-square)](https://www.npmjs.com/package/backbone.do)

* [Install](#install)
* [API](#api)
* [Bugs](#bugs)
* [Contributors](#contributors)
* [License](#license)

## Install

Install using the package manager for your desired environment(s):

``` bash
$ npm install --save backbone.do
# OR:
$ bower install --save backbone.do
```

You will also need to ensure that you have [Backbone](http://backbonejs.org) and [Underscore](http://underscorejs.org)
installed.

If you want to simply download the file to be used in the browser you can find them below:

* [Development Version](https://cdn.rawgit.com/neocotic/Backbone.Do/master/lib/backbone.do.js) (7kb)
* [Production Version](https://cdn.rawgit.com/neocotic/Backbone.Do/master/dist/backbone.do.min.js) (1.9kb - [Source Map](https://cdn.rawgit.com/neocotic/Backbone.Do/master/dist/backbone.do.min.map))

## API

The API supports both Backbone collections *and* models. The main difference what data is sent to the server when
selected model attributes are sent and how the server response is handled.

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
POST https://example.com/books/hobbit/buy
GET  https://example.com/books/hobbit/pages?pageCount=310
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

Any other undocumented configurations will simply be passed along to [Backbone.sync](http://backbonejs.org/#Sync) and,
eventually, [Backbone.ajax](http://backbonejs.org/#Sync-ajax) as options. Action functions also support the same
asynchronous patterns as [Backbone.ajax](http://backbonejs.org/#Sync-ajax), whose result is also used as their return
value.

#### `attrs`

Type(s): `String` `String[]`

A subset of attributes to be picked from the model and sent to the server. If used on a collection, this is done for
each child model of the collection and then that mapping is sent to the server.

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

The CRUD method to be passed to [Backbone.sync]http://backbonejs.org/#Sync. By default this is the value of
[defaultMethod](#defaultmethod). This can be any of the following methods;

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

If you have any problems with Backbone.Do or would like to see changes currently in development you can do so
[here](https://github.com/neocotic/Backbone.Do/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/neocotic/Backbone.Do/blob/master/CONTRIBUTING.md). We want your suggestions and
pull requests!

A list of Backbone.Do contributors can be found in
[AUTHORS.md](https://github.com/neocotic/Backbone.Do/blob/master/AUTHORS.md).

## License

Copyright © 2017 Alasdair Mercer

See [LICENSE.md](https://github.com/neocotic/Backbone.Do/blob/master/LICENSE.md) for more information on our MIT
license.
