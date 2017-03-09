(function () {
    'use strict';
    angular.module('expensesApp').directive('mcSwitch', [
        mcSwitch
    ]);

    function mcSwitch() {
        return {
            restrict: 'A',
            scope: {
                model: '=mcSwitch'
            },
            require: '?mcSwitch',
            template: '<input type="checkbox">',
            link: function (scope, element, attrs, controller) {
                element.addClass('make-switch');

                if (attrs.mcSwitchOnLabel) {
                    element.data('on-label', attrs.mcSwitchOnLabel);
                }

                if (attrs.mcSwitchOffLabel) {
                    element.data('off-label', attrs.mcSwitchOffLabel);
                }

                //element.bootstrapSwitch();

                element.bootstrapSwitch('setState', scope.model);

                element.on('switch-change', function (e, data) {
                    scope.$apply(function () {
                        scope.model = data.value;
                    });
                });

                scope.$watch(scope.model, function (newValue, oldValue) {
                    element.bootstrapSwitch('setState', scope.model);
                }, true);
            }
        };
    }

}());