(function () {
    'use strict';

    angular.module('expensesApp').directive('mcCompanyPoints', [
		companyPoints
    ]);

    function companyPoints() {
        return {
            restrict: 'E',
            scope: {
                info: '=info'
            },
            templateUrl: 'reports/ReportCompanyPoints.html'
        };
    }

}());