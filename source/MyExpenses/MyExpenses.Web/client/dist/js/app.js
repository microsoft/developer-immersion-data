(function appInit(global) {

    'use strict';

    var expensesApp = angular.module('expensesApp', [
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngLocale',
        'app.templates',
        'AdalAngular',
        'ui.bootstrap']);

    // Configure Toastr
    toastr.options.timeOut = 10000;
    toastr.options.positionClass = 'toast-bottom-right';

    expensesApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);

    expensesApp.config(function ($routeProvider) {

        $routeProvider
            .when('/', { controller: 'ReportsListCtrl', templateUrl: 'ReportsList.html', requireADLogin: true })
            .when('/reports', { controller: 'ReportsListCtrl', templateUrl: 'ReportsList.html', requireADLogin: true })
            .when('/report/:reportCode', { controller: 'ReportCtrl', templateUrl: 'Report.html', requireADLogin: true })
            .when('/team-expenses', { controller: 'TeamExpensesCtrl', templateUrl: 'TeamExpenses.html', requireADLogin: true })
            .when('/team-report/:reportCode', { controller: 'TeamReportCtrl', templateUrl: 'TeamReport.html', requireADLogin: true })
            .when('/gifts-catalog', { controller: 'GiftCatalogCtrl', templateUrl: 'GiftCatalog.html', requireADLogin: true })
            .when('/purchases-history', { controller: 'PurchasesHistoryCtrl', templateUrl: 'PurchasesHistory.html', requireADLogin: true })
            .when('/profile', { controller: 'ProfileCtrl', templateUrl: 'Profile.html', requireADLogin: true })
            .when('/anomalies', { controller: 'AnomaliesCtrl', templateUrl: 'Anomalies.html', requireADLogin: true })
            .when('/login', { controller: 'LoginCtrl', template: ''})
            .otherwise({ templateUrl: '404.html' });

    });

    expensesApp.config(function (adalAuthenticationServiceProvider, $httpProvider) {
        adalAuthenticationServiceProvider.init({
            clientId: global.configs.clientId,
        }, $httpProvider);
    });

    expensesApp.run(function ($location, authSvc, redirectSvc, notificationsSvc) {

        var token = ($location.search()).token;
        var expiration = ($location.search()).expiration;
        if (token && expiration) {

            redirectSvc.redirect();
        }

        if (!authSvc.isAuthenticated()) {

            var urlToRedirect = $location.url();
            if (urlToRedirect && (urlToRedirect !== '/')) {
                redirectSvc.setRedirectUrl(urlToRedirect);
            }

            $location.url('/');
        } else {
            notificationsSvc.start(authSvc.getAuthToken());
        }

    });

}(this));