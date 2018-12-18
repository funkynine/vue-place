'use strict';

new Vue({
    el:'[data-js-searchbar]',
    data: {
        query: '',
        oldQuery: '',
        url: 'https://api.teleport.org/api/cities/?search=',
        items: [],
        isActive: false,
        googleLink: 'https://www.google.com.ua/maps/place/',
        timer: null,
        minChars: 3,
        updateTime: 300
    },
    computed: {
        queryStr: function () {
            return this.query.trim();
        }
    },
    methods: {
        fetch: function () {
            this.$http
                .get(this.url + this.queryStr)
                .then(this.renderItems);
        },
        renderItems: function (response) {
            var googleLink = this.googleLink;
            this.items = response.body._embedded['city:search-results']
                .map(function(item) {
                    return {
                        name: item.matching_full_name,
                        link: googleLink + item.matching_full_name
                    }
                })
            if (this.items.length) this.isActive = true;
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
            this.item = [];
            this.query = '';
        },
        hide: function () {
            this.isActive = false;
            this.oldQuery = this.query;
        },
        update: function () {
            if (this.timer) clearTimeout(this.timer);
            if (!this.query) this.reset();
            if (this.queryStr.length < this.minChars) {
                this.hide();
            } else {
                if (this.oldQuery !== this.query) {
                    this.timer = setTimeout(this.fetch, this.updateTime);
                } else {
                    this.isActive = true;
                }
            }
        },
        show: function () {
            if (this.queryStr.length >= this.minChars) {
                this.isActive = true;
            }
        }
    }
});
