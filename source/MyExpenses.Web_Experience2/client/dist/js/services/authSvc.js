(function (global) {
    'use strict';

    angular.module('expensesApp').factory('authSvc', authSvc);

    function authSvc($location, adalAuthenticationService) {

        function isAuthenticated() {
            return adalAuthenticationService.userInfo && adalAuthenticationService.userInfo.isAuthenticated;
        }

        function getAuthToken() {
            return adalAuthenticationService.getCachedToken(global.configs.clientId)
        }

        function login() {
            adalAuthenticationService.login();
        }

        function logout() {
            adalAuthenticationService.logOut();
        }

        function getUser() {
            return adalAuthenticationService.userInfo;
        }

        var service = {
            isAuthenticated: isAuthenticated,
            getAuthToken: getAuthToken,
            login: login,
            logout: logout,
            getUser: getUser
        };

        return service;
    }
}(this));