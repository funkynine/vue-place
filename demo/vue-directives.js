'use strict';

Vue.directive('click-outside', {
    bind: function (el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== 'function') {
            var compName = vNode.context.name,
                warn = '[Vue-click-outside:] provided expression \'' + binding.expression + '\' is not a function, but has to be';
            if (compName) warn += 'Found in component \'' + compName + '\'';

            console.warn(warn);
        }
        // Define Handler and cache it on the element
        var bubble = binding.modifiers.bubble,
            handler = function handler(e) {
                if (bubble || !el.contains(e.target) && el !== e.target) binding.value(e);
            };
        el.__vueClickOutside__ = handler;

        // add Event Listeners
        document.addEventListener('click', handler);
    },
    unbind: function (el, binding) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
    }
});