'use strict';
(function() {
    var field = document.querySelectorAll('[data-js-materialize-input]');
    for (var i = 0, iLength = field.length; i < iLength; i++) {
        field[i].addEventListener('focusin', function(e) {
            e.target.previousElementSibling.classList.add('active');
        });
        field[i].addEventListener('focusout', function(e) {
            if (!e.target.value) {
                e.target.previousElementSibling.classList.remove('active');
            }
        });
    }
})();