(function () {
    'use strict';

    angular
        .module('expensesApp')
        .factory('menuSvc', [
            '$q',
            'contextSvc',
            'dataSvc',
            menuSvc
        ]);

    function menuSvc($q, contextSvc, dataSvc) {

        function getMenuOptions() {
            var employee = contextSvc.getCurrentUser(),
                existEmployee = employee !== null,
                isManager = existEmployee && employee.isTeamManager;                

            return dataSvc.getReportLink().then(function (link) {
                var pages = [
                    {
                        display: 'My expenses',
                        url: '#/reports',
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
                    },
                    {
                        display: 'Report Charts',
                        url: link,
                        target: '_blank',
                        iconClass: 'icon-chart',
                        visible: existEmployee,
                        controllers: []
                    }
                ];

                return pages;
            });      
        }

        var service = {
            getMenuOptions: getMenuOptions
        };

        return service;

    }

}());