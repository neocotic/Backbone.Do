## Version 1.0.1, 2017.09.12

* Restructure code base slightly [#16](https://github.com/neocotic/Backbone.Do/issues/16)
* Add [EditorConfig](http://editorconfig.org) file [#19](https://github.com/neocotic/Backbone.Do/issues/19)
* Tidy up documentation [#21](https://github.com/neocotic/Backbone.Do/issues/21)
* Remove references to neocotic.com [#25](https://github.com/neocotic/Backbone.Do/issues/25)
* Increase supported range for [Backbone](http://backbonejs.org) (from `^1.1.2` to `>=1.0.0`) and [Underscore](http://underscorejs.org) (from `^1.5.0` to `>=1.4.3`)
* Improve UMD pattern used in file header
* Improve build
* Bump devDependencies
* Tidy repository

## Version 1.0.0, 2014.09.16

* Add support for `Backbone.Collection` [#4](https://github.com/neocotic/Backbone.Do/issues/4)
* Add support for [Backbone](http://backbonejs.org) v1.1.2 [#5](https://github.com/neocotic/Backbone.Do/issues/5)
* Change methods from HTTP to CRUD to match [Backbone](http://backbonejs.org) API [#8](https://github.com/neocotic/Backbone.Do/issues/8)
* Change `Backbone.Do.defaultMethod` to `update` [#8](https://github.com/neocotic/Backbone.Do/issues/8)
* Change parameters for calling action methods to `data` and `options` (both still optional) [#10](https://github.com/neocotic/Backbone.Do/issues/10)
* Action names must not match any existing property names [#10](https://github.com/neocotic/Backbone.Do/issues/10)
* Fix bug with [Backbone](http://backbonejs.org) module import on [node.js](http://nodejs.org) [#11](https://github.com/neocotic/Backbone.Do/issues/11)
* Improve code styling
* Bump development dependencies

## Version 0.1.4, 2014.06.26

* Custom URL paths are no longer encoded [#6](https://github.com/neocotic/Backbone.Do/issues/6)

## Version 0.1.3, 2013.08.07

* Fix error when invoking actions [#3](https://github.com/neocotic/Backbone.Do/issues/3)
* Change default HTTP method to `POST`
* Fix bug where data was not sent as parameters for `GET` requests

## Version 0.1.2, 2013.08.06

* Add configuration overloading example to `README.md` [#1](https://github.com/neocotic/Backbone.Do/issues/1)
* Give `data` configuration priority over `attrs` [#2](https://github.com/neocotic/Backbone.Do/issues/2)
