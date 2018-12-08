'use strict';

new Vue({
    el: '[data-js-search]',
    components: {
        'typeahead': {
            props: ['minChars', 'updatedTime'],
            data: function () {
                return {
                    query: '',
                    oldQuery: '',
                    items: [],
                    timer: null,
                    isActive: false,
                    isSubmitActive: false,
                    url: 'https://api.teleport.org/api/cities/?search=',
                    googleLink: 'https://www.google.com.ua/maps/place/'
                }
            },
            computed: {
                queryStr: function () {
                    return this.query.trim();
                },
                minCharsNumber: function () {
                    return Number(this.minChars);
                }
            },
            methods: {
                renderItems: function (response) {
                    var data = JSON.parse(response.bodyText);
                    this.items = data._embedded['city:search-results'].map(function(item) {
                        return {
                            name: item.matching_full_name,
                            link: this.googleLink + item.matching_full_name
                        }
                    }.bind(this));
                    if (this.items.length) {
                        this.isActive = true;
                    }
                },
                fetch: function () {
                    this.$http
                        .get(this.url + this.queryStr)
                        .then(this.renderItems);
                },
                update: function () {
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }
                    if (!this.query) {
                        this.reset();
                    }
                    if (this.queryStr.length < this.minCharsNumber) {
                        this.hide();
                        this.isSubmitActive = false;
                    } else {
                        this.isSubmitActive = true;
                        if (this.oldQuery !== this.query) {
                            this.timer = setTimeout(this.fetch, this.minCharsNumber);
                        } else {
                            this.isActive = true;
                        }
                    }
                },
                highlightedVal: function (value) {
                    if (value) {
                        var regEx = new RegExp(this.query, 'i'),
                            foundValue = value.match(regEx);
                        return value.replace(foundValue, '<strong style="color: red">' + foundValue + '</strong>');
                    } else {
                        return value;
                    }
                },
                reset: function () {
                    this.items = [];
                    this.query = '';
                },
                hide: function () {
                    this.isActive = false;
                    this.isSubmitActive = (this.queryStr.length < this.minCharsNumber) ? false : true;
                    this.oldQuery = this.query;
                },
                show: function () {
                    if (this.queryStr.length >= this.minCharsNumber) {
                        this.isActive = true;
                    }
                }
            },
            directives: {
                clickOutside: {
                    bind: function (el, binding, vNode) {
                        if (typeof binding.value !== 'function') {
                            var compName = vNode.context.name,
                                warn = '[Vue-click-outside:] provided expression \'' + binding.expression + '\' is not a function, but has to be';
                            if (compName) warn += 'Found in component \'' + compName + '\'';
                            console.warn(warn);
                        }
                        var bubble = binding.modifiers.bubble,
                            handler = function handler(e) {
                                if (bubble || !el.contains(e.target) && el !== e.target) binding.value(e);
                            };
                        el.__vueClickOutside__ = handler;
                        document.addEventListener('click', handler);
                    },
                    unbind: function (el) {
                        document.removeEventListener('click', el.__vueClickOutside__);
                        el.__vueClickOutside__ = null;
                    }
                }
            }
        }
    }
});
