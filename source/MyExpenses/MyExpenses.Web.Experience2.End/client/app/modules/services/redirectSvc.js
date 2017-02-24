(function () {
    'use strict';

    angular.module('expensesApp').factory('redirectSvc', [
        '$window',
        '$location',
        redirectSvc
    ]);

    function redirectSvc($window, $location) {

        function setRedirectUrl(redirectUrl) {
            $window.localStorage.redirectUrl = redirectUrl;
        }

        function getRedirectUrl() {
            return $window.localStorage.redirectUrl;
        }

        function clear() {
            $window.localStorage.removeItem('redirectUrl');
        }

        function redirect() {

            var urlToRedirect = getRedirectUrl();

            if (urlToRedirect) {
                $location.url(urlToRedirect);
            }
            else {
                $location.url('/');
            }

            clear();
        }

        var service = {
            setRedirectUrl: setRedirectUrl,
            redirect: redirect
        };

        return service;
    }
}());