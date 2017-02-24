(function () {
    'use strict';

    angular
        .module('expensesApp')
        .factory('menuSvc', [
            '$q',
            'contextSvc',
            menuSvc
        ]);

    function menuSvc($q, contextSvc) {

        function getMenuOptions() {
            var employee = contextSvc.getCurrentUser(),
                existEmployee = employee !== null,
                isManager = existEmployee && employee.isTeamManager;                

            var pages = [
                    {
                        display: 'My expenses',
                        url: '#/',
                        iconClass: 'icon-myexpenses',
                        visible: existEmployee,
                        controllers: ['ReportsListCtrl', 'ReportCtrl']
                    },
                    {
                        display: 'Team expenses',
                        url: '#/team-expenses',
                        iconClass: 'icon-teamexpenses',
                        visible: isManager,
                        controllers: ['TeamExpensesCtrl', 'TeamReportCtrl']
                    },
                    {
                        display: 'Gift catalog',
                        url: '#/gifts-catalog',
                        iconClass: 'icon-gifts',
                        visible: existEmployee,
                        controllers: ['GiftCatalogCtrl']
                    }
            ];

            return pages;
        }

        var service = {
            getMenuOptions: getMenuOptions
        };

        return service;

    }

}());