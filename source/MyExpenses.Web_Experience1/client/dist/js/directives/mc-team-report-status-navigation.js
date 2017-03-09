(function () {
    'use strict';
    angular.module('expensesApp').directive('mcTeamReportStatusNavigation', [
        reportStatusNavigation
    ]);

    function reportStatusNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'ReportStatusNavigation.html',
            controller: 'TeamExpensesStatusesCtrl'
        };
    }

}());