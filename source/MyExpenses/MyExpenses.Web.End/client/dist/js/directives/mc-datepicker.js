(function () {
    'use strict';
    angular.module('expensesApp').directive('mcDatepicker', [
        'settings',
        datePicker
    ]);

    function datePicker(settings) {

        function firstIsLessOrEqualSecond(first, second) {
            var firstDate = new Date(first);
            var secondDate = new Date(second);
            return firstDate <= secondDate;
        }

        function firstIsEqualOrGreaterSecond(first, second) {
            var firstDate = new Date(first);
            var secondDate = new Date(second);
            return firstDate >= secondDate;
        }

        return {
            restrict: 'A',
            scope: {
                dateValue: '=ngModel',
                form: '=mcForm',
                lessOrEqual: '@mcIsLessOrEqual',
                whenLessOrEqual: '=mcIsLessOrEqualWhen',
                equalOrGreater: '@mcIsEqualOrGreater',
                whenEqualOrGreater: '=mcIsEqualOrGreaterWhen'               
            },
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {
                element.datepicker({
                    format: 'mm/dd/yyyy',
                    language: 'en',
                    autoclose: true
                });

                element.datepicker('setDate', scope.dateValue);

                element.on('changeDate', function (ev) {
                    scope.dateValue = moment(ev.date).format(settings.dateFormat);
                });

                scope.$on('$destroy', function () {
                    var datepicker = element.data('datepicker');
                    if (datepicker) {
                        datepicker.picker.remove();
                        element.data('datepicker', null);
                    }
                });

                if (scope.whenLessOrEqual !== undefined) {
                    scope.$watch('whenLessOrEqual', function (newValue, oldValue) {
                        var lessOrEqualValue = scope.form[scope.lessOrEqual];
                        var shouldReset = newValue !== oldValue && newValue === false;
                        if (shouldReset) {
                            controller.$setValidity('lessOrEqual', true);
                            lessOrEqualValue.$setValidity('equalOrGreater', true);
                        }
                        var shouldReevaluate = newValue !== oldValue && newValue === true;
                        if (shouldReevaluate) {
                            if (firstIsLessOrEqualSecond(controller.$viewValue, lessOrEqualValue.$viewValue)) {
                                // it is valid
                                controller.$setValidity('lessOrEqual', true);
                                lessOrEqualValue.$setValidity('equalOrGreater', true);
                            } else {
                                // it is invalid, return undefined (no model update)
                                controller.$setValidity('lessOrEqual', false);
                                lessOrEqualValue.$setValidity('equalOrGreater', false);
                            }
                        }
                    }, true);
                }

                if (scope.whenEqualOrGreater !== undefined) {
                    scope.$watch('whenEqualOrGreater', function (newValue, oldValue) {
                        var equalOrGreaterValue = scope.form[scope.equalOrGreater];
                        var shouldReset = newValue !== oldValue && newValue === false;
                        if (shouldReset) {
                            controller.$setValidity('equalOrGreater', true);
                            equalOrGreaterValue.$setValidity('lessOrEqual', true);
                        }
                        var shouldReevaluate = newValue !== oldValue && newValue === true;
                        if (shouldReevaluate) {

                            if (firstIsEqualOrGreaterSecond(controller.$viewValue, equalOrGreaterValue.$viewValue)) {
                                // it is valid
                                controller.$setValidity('equalOrGreater', true);
                                equalOrGreaterValue.$setValidity('lessOrEqual', true);
                            } else {
                                // it is invalid, return undefined (no model update)
                                controller.$setValidity('equalOrGreater', false);
                                equalOrGreaterValue.$setValidity('lessOrEqual', false);
                            }
                        }
                    }, true);
                }

                controller.$parsers.unshift(function (viewValue) {
                    if (scope.whenLessOrEqual) {
                        var lessOrEqualValue = scope.form[scope.lessOrEqual];
                        if (firstIsLessOrEqualSecond(viewValue, lessOrEqualValue.$viewValue)) {
                            // it is valid
                            controller.$setValidity('lessOrEqual', true);
                            lessOrEqualValue.$setValidity('equalOrGreater', true);
                        } else {
                            // it is invalid, return undefined (no model update)
                            controller.$setValidity('lessOrEqual', false);
                            lessOrEqualValue.$setValidity('equalOrGreater', false);
                        }
                    }

                    if (scope.whenEqualOrGreater) {
                        var equalOrGreaterValue = scope.form[scope.equalOrGreater];
                        if (firstIsEqualOrGreaterSecond(viewValue, equalOrGreaterValue.$viewValue)) {
                            // it is valid
                            controller.$setValidity('equalOrGreater', true);
                            equalOrGreaterValue.$setValidity('lessOrEqual', true);
                        } else {
                            // it is invalid, return undefined (no model update)
                            controller.$setValidity('equalOrGreater', false);
                            equalOrGreaterValue.$setValidity('lessOrEqual', false);
                        }
                    }

                    return viewValue;
                });

                element.val(scope.dateValue);
            }
        };
    }
}());