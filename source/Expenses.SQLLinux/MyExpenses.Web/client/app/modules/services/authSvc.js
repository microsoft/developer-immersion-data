(function (global) {
    'use strict';

    angular.module('expensesApp').factory('authSvc', authSvc);

    function authSvc($window,$location, redirectSvc) {
 
 var authenticathed = false;
        function isAuthenticated() {
           return $window.localStorage.getItem("authenticated") == 'true';
        }

        function getAuthToken() {
            return '';
        }

        function login() {
            $window.localStorage.setItem("authenticated", "true");
            $window.location.reload();
                             }

        function logout() {
            $window.localStorage.setItem("authenticated", "false");
              $window.location.reload();
              
                    }

        var service = {
            isAuthenticated: isAuthenticated,
            getAuthToken: getAuthToken,
            login: login,
            logout: logout
        };

        return service;
    }
}(this));