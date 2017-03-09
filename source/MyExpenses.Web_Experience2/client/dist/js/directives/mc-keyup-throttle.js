(function () {
    'use strict';
    angular.module('expensesApp').directive('mcKeyupThrottle', [
        mcKeyup
    ]);

    function mcKeyup() {
        var timeOut,
            defaultDelay = 300;
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                var functionToEvaluete = attrs.mcKeyupThrottle;
                var delay = attrs.mcKeyupThrottleDelay || defaultDelay;

                var search = function () {
                    if (timeOut) {
                        clearTimeout(timeOut);
                    }
                    timeOut = setTimeout(function () {
                        scope.$apply(function (s) {
                            s.$eval(functionToEvaluete);
                        });
                    }, delay);
                };

                var bindEvents = function () {
                    element.bind('keypress', function () {
                        search();
                    });

                    element.bind('keyup', function (e) {
                        if (e.which === 8 || e.which === 13 || e.which === 46)
                            //8- backslash, 13-enter, 46-delete
                            search();
                    });
                };

                bindEvents();
            }
        };
    }

}());