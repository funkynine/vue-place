'use strict';

new Vue({
    el: '[data-js-searchbar]',
    data: {
        query: '',
        oldQuery: '',
        items: [],
        timer: null,
        isActive: false,
        minChars: 3,
        updatedTime: 300,
        url: 'https://api.teleport.org/api/cities/?search=',
        googleLink: 'https://www.google.com.ua/maps/place/'
    },
    computed: {
        queryStr: function () {
            return this.query.trim();
        }
    },
    methods: {
        renderItems: function (response) {
            var data = JSON.parse(response.bodyText),
                googleLink = this.googleLink;
            this.items = data._embedded['city:search-results'].map(function(item) {
                return {
                    name: item.matching_full_name,
                    link: googleLink + item.matching_full_name
                };
            });
            if (this.items.length) {
                this.isActive = true;
            }
        },
        fetch: function () {
            this.$http.get(this.url + this.queryStr).then(this.renderItems);
        },
        update: function () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (!this.query) {
                this.reset();
            }
            if (this.queryStr.length < this.minChars) {
                this.hide();
            } else {
                if (this.oldQuery !== this.query) {
                    this.timer = setTimeout(this.fetch, this.updatedTime);
                } else {
                    this.isActive = true;
                }
            }
        },
        highlightedVal: function (value) {
            if (value) {
                var regEx = new RegExp(this.query, 'i'),
                    foundValue = value.match(regEx);
                return value.replace(foundValue, '<strong class="highlight">' + foundValue + '</strong>');
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
            this.oldQuery = this.query;
        },
        show: function () {
            if (this.queryStr.length >= this.minChars) {
                this.isActive = true;
            }
        }
    }
});
