(function () {
    'use strict';

    angular.module('expensesApp').controller('LandingCtrl', ['$scope','$location', 'authSvc', landingCtrl]);

    function landingCtrl($scope, $location, authSvc) {
        var vm = $scope;
        vm.doLogin = doLogin;

        //window.location.replace('#/reports');

        $scope.hideLoading();
        //alert('auth: ' + authSvc.isAuthenticated());
        if (authSvc.isAuthenticated()) {
            $location.url('/reports');
        }
       
        function doLogin() {
            $location.url('/reports');
        }
    }
} ());
