Backbone Prototype.js is an adapter for using Backbone with the Prototype.js framework. The 
basic idea behind it is to use a jQuery-like API as a wrapper to Prototype calls to allow us 
to seamlessly use Backbone.js without changing its internals.

**Idea, documentation, code structure and implementation are simply a modified version of 
the excelent mootools adapter (https://github.com/inkling/backbone-mootools).**

## Usage

To use backbone-prototypejs download prototype_adapter.js and embed it before the 
backbone.js include.

For example:

    <script src="http://www.yourwebsite.com/prototypejs-1.7.js>
    <script src="http://www.yourwebsite.com/backbone.js"></script>
    <script src="http://www.yourwebsite.com/prototype_adapter.js"></script>

## Dependencies

This adapter has been tested with the lastest stable prototypejs release (1.7).

## Supported Libraries

This library is designed to be used with the backbone project, which is linked to in a
submodule. All the details on backbone and its license can be found at
[http://documentcloud.github.com/backbone](http://documentcloud.github.com/backbone).

## Copyright and License

Copyright 2012 Sebastian Zaha
Copyright 2011 Inkling Systems, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
