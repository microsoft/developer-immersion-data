(function () {
    'use strict';

    angular.module('expensesApp').filter('mcdate', ['settings', mcdate]);

    function mcdate(settings) {
        return function (input) {
            return moment(input).format(settings.dateFormat);
        }
    }
}());