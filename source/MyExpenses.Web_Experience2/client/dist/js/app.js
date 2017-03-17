(function appInit(global) {

    'use strict';

    var expensesApp = angular.module('expensesApp', [
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngLocale',
        'app.templates',
        'AdalAngular',
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
            .when('/reports', { controller: 'ReportsListCtrl', templateUrl: 'ReportsList.html', requireADLogin: true })
            .when('/report/:reportCode', { controller: 'ReportCtrl', templateUrl: 'Report.html', requireADLogin: true })
            .when('/team-expenses', { controller: 'TeamExpensesCtrl', templateUrl: 'TeamExpenses.html', requireADLogin: true })
            .when('/team-report/:reportCode', { controller: 'TeamReportCtrl', templateUrl: 'TeamReport.html', requireADLogin: true })
            .when('/gifts-catalog', { controller: 'GiftCatalogCtrl', templateUrl: 'GiftCatalog.html', requireADLogin: true })
            .when('/purchases-history', { controller: 'PurchasesHistoryCtrl', templateUrl: 'PurchasesHistory.html', requireADLogin: true })
            .when('/profile', { controller: 'ProfileCtrl', templateUrl: 'Profile.html', requireADLogin: true })
            .when('/anomalies', { controller: 'AnomaliesCtrl', templateUrl: 'Anomalies.html', requireADLogin: true })
            //.when('/report-chart', { controller: 'ReportChartCtrl', templateUrl: 'ReportChart.html', requireADLogin: true })
            .when('/login', { controller: 'LoginCtrl', template: ''})
            .otherwise({ templateUrl: '404.html' });

    });

    expensesApp.config(function (adalAuthenticationServiceProvider, $httpProvider) {
        adalAuthenticationServiceProvider.init({
            clientId: global.configs.clientId,
        }, $httpProvider);
    });

    expensesApp.run(function ($location, $rootScope, authSvc, redirectSvc, notificationsSvc) {

        // This code is for preventing errors in early versions of IE11 (related to an Adal behavior on changes of the location hash)
        // https://github.com/AzureAD/azure-activedirectory-library-for-js/issues/145#issuecomment-205687778
        var isAdalFrame = window !== window.parent;
        $rootScope.$on('$locationChangeStart', function (e) {

            if ($location.path().indexOf('access_token') > -1 ||
                $location.path().indexOf('id_token') > -1 ||
                $location.path().indexOf('/error=') === 0 ||
                isAdalFrame
            ) {
                e.preventDefault();
            }
        });

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