(function () {
    'use strict';
    angular.module('expensesApp').directive('mcExpenseIco', [
        mcKeyup
    ]);

    function mcKeyup() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                element.addClass('medium-category-icon');
                element.addClass(attrs.mcExpenseIco);
            }
        };
    }

}());