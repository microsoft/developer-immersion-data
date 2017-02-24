(function () {
    'use strict';

    angular.module('expensesApp').factory('contextSvc', contextSvc);

    function contextSvc($rootScope, constants, authSvc) {

        var currentUser = null;

        function setCurrentUser(data) {
            currentUser = data;
            $rootScope.$broadcast(constants.userInfoUpdatedMessage);
            return currentUser;
        };

        function getCurrentUser() {
            return currentUser;
        };

        function clearCurrentUser() {
            currentUser = null;
            $rootScope.$broadcast(constants.userInfoUpdatedMessage);
        };

        var service = {
            getCurrentUser: getCurrentUser,
            setCurrentUser: setCurrentUser,
            clearCurrentUser: clearCurrentUser
        };

        return service;
    }

}());