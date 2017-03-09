(function () {
    'use strict';

    angular.module('expensesApp').constant('settings', {
        pageSize: 10,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'HH:mm',
        weekStartsOnMonday: false,
    });

}());