/**
 * PrototypeAdapter 0.1
 * Copyright 2012 Sebastian Zaha
 * 
 * Idea, documentation, code structure and implementation are simply a modified version of 
 * the excelent mootools adapter linked below.
 *
 * Original details and documentation:
 * http://github.com/inkling/backbone-mootools
 *
 * Copyright 2011 Inkling Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This file provides a basic jQuery to Prototype.js Adapter. It allows us to run Backbone.js
 * with minimal modifications.
 */
(function(window) {
    var PrototypeAdapter = Class.create({
        initialize: function(elements) {
            for (var i = 0; i < elements.length; i++) {
                this[i] = elements[i];
                if (!this[i]._handlers) this[i]._handlers = [];
            }
            this.length = elements.length;
        },

        /**
         * Hide the elements defined by the PrototypeAdapter from the screen.
         */
        hide: function() {
            for (var i = 0; i < this.length; i++) {
                this[i].setStyle({display: 'none'});
            }
            return this;
        },

        /**
         * Append the first element in the PrototypeAdapter to the elements found by the passed in
         * selector. If the selector selects more than one element, a clone of the first element is
         * put into every selected element except the first. The first selected element always
         * adopts the real element.
         *
         * @param selector A CSS3 selector.
         */
        appendTo: function(selector) {
            var elements = Element.select(document, selector);

            for (var i = 0; i < elements.length; i++) {
                if (i > 0) {
                    elements[i].insert(Object.clone(this[0]));
                } else {
                    elements[i].insert(this[0]);
                }
            }

            return this;
        },

        /**
         * Set the attributes of the element defined by the PrototypeAdapter.
         *
         * @param map:Object literal map definining the attributes and the values to which
         *     they should be set.
         *
         * @return PrototypeAdapter The object on which this method was called.
         */
        attr: function(map) {
            for (var i = 0; i < this.length; i++) {
                this[i].writeAttribute(map);
            }
            return this;
        },

        /**
         * Set the HTML contents of the elements contained by the PrototypeAdapter.
         *
         * @param htmlString:String A string of HTML text.
         *
         * @return PrototypeAdapter The object the method was called on.
         */
        html: function(htmlString) {
            for (var i = 0; i < this.length; i++) {
                this[i].update(htmlString);
            }
            return this;
        },

        /**
         * Split an event string into the event name and the namespace
         * For Example: click.backbone_view -> {name: 'click', namespace: 'backbone_view'}
         *
         * @param eventName:String A string representing an event name including a namespace
         *
         * @return Object An object of the form: {name: 'click', namespace: 'customNamespace'}
         */
        _parseEventNamespaces: function(eventName) {
            var dotIndex = eventName.indexOf('.');

            if (dotIndex != '-1') {
                return {
                    name: eventName.substr(0, dotIndex),
                    namespaces: _.compact(eventName.substr(dotIndex + 1).split('.'))
                }
            } else {
                return {name: eventName, namespaces: []};
            }
        },

        _saveEventHandler: function(element, eventName, namespaces, handler) {
            handler._eventName = eventName;
            handler._namespaces = namespaces;
            element._handlers.push(handler);
        },

        /**
         * Delegate an event that is fired on the elements defined by the selector to trigger the
         * passed in callback.
         *
         * @param selector:String A CSS3 selector defining which elements should be listenining to
         *     the event.
         * @param eventName:String The name of the event.
         * @param method:Function The callback to call when the event is fired on the proper
         *     element.
         *
         * @return PrototypeAdapter The object the method was called on.
         */
        delegate: function(selector, eventName, method) {
            event = this._parseEventNamespaces(eventName);

            for (var i = 0; i < this.length; i++) {
                var handler = Event.on(this[i], event.name, selector, method);
                this._saveEventHandler(this[i], event.name, event.namespaces, handler);
            }

            return this;
        },

        /**
         * Bind the elements on the PrototypeAdapter to call the specific method for the specific
         * event.
         *
         * @param eventName:String The name of the event.
         * @param method:Function The callback to apply when the event is fired.
         *
         * @return PrototypeAdapter The object the method was called on.
         */
        bind: function(eventName, method) {
            return this.delegate(null, eventName, method);
        },

        /**
         * Unbind the bound events for the element.
         *
         * @param eventName:String Either a simple event name like 'click' or namespaced 'click.ns' or 
         *      '.ns' or '' or '' or 'click.ns1.ns2'
         */
        unbind: function(eventName) {
            event = this._parseEventNamespaces(eventName);

            for (var i = 0; i < this.length; i++) {
                this[i]._handlers = _.filter(this[i]._handlers, function(handler) {
                    if (!_.isEmpty(event.name) && (handler._eventName != event.name)) return true;
                    // All namespaces in query should be present on the handler.
                    if (!_.isEmpty(_.difference(event.namespaces, handler._namespaces))) return true;
                    
                    handler.stop();
                    return false;
                });
            }
                      
            return this;
        },

        /**
         * Return the element at the specified index on the PrototypeAdapter.
         * Equivalent to PrototypeAdapter[index].
         *
         * @param index:Number a numerical index.
         *
         * @return HTMLElement An HTML element from the PrototypeAdapter. Returns undefined
         *     if an element at that index does not exist.
         */
        get: function(index) {
            return this[index];
        },

         /**
          * Removes from the DOM all the elements selected by the PrototypeAdapter.
          */
        remove: function() {
            for (var i = 0; i < this.length; i++) {
                this[i].remove();
            }
            return this;
        },

        /**
         * Add a callback for when the document is ready.
         */
        ready: function(callback) {
            for (var i = 0; i < this.length; i++) {
                Element.observe(document, 'dom:loaded', callback);
            }
        },

        /**
         * Return the text content of all the elements selected by the MooToolsAdapter.
         * The text of the different elements is seperated by a space.
         *
         * @return String The text contents of all the elements selected by the MooToolsAdapter.
         */
        text: function() {
            var text = [];
            for (var i = 0; i < this.length; i++) {
                text.push(this[i].innerHTML);
            }
            return text.join(' ');
        },

        _dispatchEvent: function(eventName, eventType, element) {
            var event;

            if (document.createEvent) {
                event = document.createEvent(eventType);
                if (eventType == 'HTMLEvents') {
                    event.initEvent(eventName, true, true);
                } else {
                    event.initMouseEvent(eventName, true, true, document.defaultView, 
                                         null, null, null, null, null, false, false, false, false, null, element);
                }
                element.dispatchEvent(event);
            } else {
                event = document.createEventObject();
                element.fireEvent('on' + eventName, event);
            }

            return event;
        },

        /**
         * Fire a specific event on the elements selected by the PrototypeAdapter. Used by tests.
         *
         * @param eventName:String
         */
        trigger: function(eventName) {
            var matchers = {
                html: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/, 
                mouse: /^(?:click|mouse(?:down|up|over|move|out))$/
            };
            var htmlEvent = eventName.match(matchers.html), mouseEvent = eventName.match(matchers.mouse), 
                eventType = htmlEvent ? 'HTMLEvents' : 'MouseEvents';

            if (htmlEvent || mouseEvent) {
                for (var i = 0; i < this.length; i++) {
                    this._dispatchEvent(eventName, eventType, this[i]);
                }
            } else {
                for (var i = 0; i < this.length; i++) {
                    _.each(this[i]._handlers, function(handler) {
                        if (handler._eventName == eventName) handler.callback.call(this[i], event);
                    }, this);
                }
            }
                
            return this;
        },

        /**
         * Find all elements that match a given selector which are descendants of the
         * elements selected the PrototypeAdapter.
         *
         * @param selector:String - A css3 selector;
         *
         * @return PrototypeAdapter A PrototypeAdapter containing the selected
         *     elements.
         */
        find: function(selector) {
            var elements = [];
            for (var i = 0; i < this.length; i++) {
                var result = this[i].select(selector);
                elements = elements.concat(result);
            }
            return new PrototypeAdapter(elements);
        }
    });


    /**
     * JQuery Selector Methods
     *
     * jQuery(html) - Returns an HTML element wrapped in a PrototypeAdapter.
     * jQuery(expression) - Returns a PrototypeAdapter containing an element set corresponding the
     *     elements selected by the expression.
     * jQuery(expression, context) - Returns a PrototypeAdapter containing an element set corresponding
     *     to applying the expression in the specified context.
     * jQuery(element) - Wraps the provided element in a PrototypeAdapter and returns it.
     *
     * @return PrototypeAdapter an adapter element containing the selected/constructed
     *     elements.
     */
    domLibraryAdapter = function(expression, context) {
        var elements;

        // Handle jQuery(html).
        if (typeof expression === 'string' && !context) {
            if (expression.charAt(0) === '<' && expression.charAt(expression.length - 1) === '>') {
                elements = [new Element('div').update(expression).down()];
                return new PrototypeAdapter(elements);
            }
        } else if (typeof expression == 'object') {
            if (expression instanceof PrototypeAdapter) {
                // Handle jQuery(PrototypeAdapter)
                return expression;
            } else {
                // Handle jQuery(element).
                return new PrototypeAdapter([expression]);
            }
        }

        // Handle jQuery(expression) and jQuery(expression, context).
        context = context || document;
        elements = Element.select(context, expression);
        return new PrototypeAdapter(elements);
    };

    /*
     * jQuery.ajax
     *
     * Maps a jQuery ajax request to a Prototype Request and sends it.
     */
    domLibraryAdapter.ajax = function(params) {
        var parameters = {
            method: params.type,
            parameters: params.data,
            contentType: params.contentType,
            onSuccess: function(response) {
                params.success(JSON.parse(response.responseText));
            },
            onFailure: params.error
        };

        new Ajax.Request(params.url, parameters);
    };

    Backbone.setDomLibrary(domLibraryAdapter);
})(window);
