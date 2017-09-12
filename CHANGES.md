## Version 1.0.0, 2014.09.16

* [#4](https://github.com/neocotic/Backbone.Do/issues/4): Add support for `Backbone.Collection`
* [#5](https://github.com/neocotic/Backbone.Do/issues/5): Add support for [Backbone][0] v1.1.2
* [#8](https://github.com/neocotic/Backbone.Do/issues/8): Change methods from HTTP to CRUD to match [Backbone][0] API
* [#8](https://github.com/neocotic/Backbone.Do/issues/8): Change `Backbone.Do.defaultMethod` to `update`
* [#10](https://github.com/neocotic/Backbone.Do/issues/10): Change parameters for calling action methods to `data` and `options` (both still optional)
* [#10](https://github.com/neocotic/Backbone.Do/issues/10): Action names must not match any existing property names
* [#11](https://github.com/neocotic/Backbone.Do/issues/11): Fix bug with [Backbone][0] module import on [node.js][1]
* Improve code styling
* Bump development dependencies

## Version 0.1.4, 2014.06.26

* [#6](https://github.com/neocotic/Backbone.Do/issues/6): Custom URL paths are no longer encoded

## Version 0.1.3, 2013.08.07

* [#3](https://github.com/neocotic/Backbone.Do/issues/3): Fix error when invoking actions
* Change default HTTP method to `POST`
* Fix bug where data was not sent as parameters for `GET` requests

## Version 0.1.2, 2013.08.06

* [#1](https://github.com/neocotic/Backbone.Do/issues/1): Add configuration overloading example to `README.md`
* [#2](https://github.com/neocotic/Backbone.Do/issues/2): Give `data` configuration priority over `attrs`

[0]: http://backbonejs.org
[1]: http://nodejs.org
