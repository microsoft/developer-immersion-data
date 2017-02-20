(function appInit(global) {

    'use strict';

    var expensesApp = angular.module('expensesApp', [
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngLocale',
        'app.templates',
        'angular.img',
        'ui.bootstrap']);

    // Configure Toastr
    toastr.options.timeOut = 10000;
    toastr.options.positionClass = 'toast-bottom-right';

    expensesApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);

    expensesApp.config(function ($routeProvider) {

        $routeProvider
            .when('/', { controller: 'LandingCtrl', templateUrl: 'Landing.html' })
            .when('/reports', { controller: 'ReportsListCtrl', templateUrl: 'ReportsList.html'})
            .when('/report/:reportCode', { controller: 'ReportCtrl', templateUrl: 'Report.html' })
            .when('/team-expenses', { controller: 'TeamExpensesCtrl', templateUrl: 'TeamExpenses.html' })
            .when('/team-report/:reportCode', { controller: 'TeamReportCtrl', templateUrl: 'TeamReport.html' })
            .when('/gifts-catalog', { controller: 'GiftCatalogCtrl', templateUrl: 'GiftCatalog.html' })
            .when('/purchases-history', { controller: 'PurchasesHistoryCtrl', templateUrl: 'PurchasesHistory.html' })
            .when('/profile', { controller: 'ProfileCtrl', templateUrl: 'Profile.html' })
            .when('/anomalies', { controller: 'AnomaliesCtrl', templateUrl: 'Anomalies.html' })
            .when('/login', { controller: 'LoginCtrl', template: ''})
            .otherwise({ templateUrl: '404.html' });

    });

    expensesApp.run(function ($location, $rootScope, authSvc, redirectSvc, notificationsSvc) {

        if (!authSvc.isAuthenticated()) {

            var urlToRedirect = $location.url();
            if (urlToRedirect && (urlToRedirect !== '/')) {
                redirectSvc.setRedirectUrl(urlToRedirect);
            }

            $location.url('/');
        } 

    });

}(this));