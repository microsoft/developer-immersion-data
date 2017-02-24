(function () {
    'use strict';

    angular.module('expensesApp').factory('authInterceptor', [
        '$q',
		'authSvc',
        authInterceptor
    ]);

    function authInterceptor($q, authSvc) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (authSvc.isAuthenticated()) {
                    config.headers.Authorization = 'Bearer ' + authSvc.getAuthToken();
                }
                return config || $q.when(config);
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    console.log('unauthorized');
                }
				
				return $q.reject(rejection);
            }
        };
    }

}());
