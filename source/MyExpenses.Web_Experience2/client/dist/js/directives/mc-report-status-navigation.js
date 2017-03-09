(function () {
    'use strict';
    angular.module('expensesApp').directive('mcReportStatusNavigation', [
        reportStatusNavigation
    ]);

    function reportStatusNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'ReportStatusNavigation.html',
            controller: 'ReportsListStatusesCtrl'
        };
    }

}());