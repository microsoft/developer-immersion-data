(function () {
    'use strict';

    angular.module('expensesApp').controller('LoginCtrl', loginCtrl);

    function loginCtrl($scope, $location, authSvc) {

        $scope.showLoading();

        if (authSvc.isAuthenticated()) {
            $location.path('/reports');
            $scope.hideLoading();
            return;
        }

        authSvc.login();

    }

}());
