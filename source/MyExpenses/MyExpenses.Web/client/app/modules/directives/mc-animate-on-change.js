(function () {
    'use strict';

    angular.module('expensesApp').directive('mcAnimateOnChange', [
        '$animate',
        animateOnChange
    ]);

    function animateOnChange($animate) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                scope.$watch(attrs.mcAnimateOnChange, function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        var className = 'change';
                        $animate.addClass(element, className, function () {
                            $animate.removeClass(element, className);
                        });
                    }
                });

            }
        };

    }

})();