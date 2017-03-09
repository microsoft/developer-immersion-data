(function () {
    'use strict';

    angular.module('expensesApp').controller('MainCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        '$location',
        'dataSvc',
        'contextSvc',
        'authSvc',
        'constants',
        mainCtrl
    ]);

    function mainCtrl($rootScope, $scope, $window, $location, dataSvc, contextSvc, authSvc, constants) {

        var processes = 0;

        var updateStatus = function () {
            $scope.isBusy = processes > 0;
        };

        var updateIsAuthenticated = function () {
            $scope.isAuthenticated = authSvc.isAuthenticated();
        };

        var cleanupContainer = [];

        $scope.isAuthenticated = authSvc.isAuthenticated();

        $scope.isBusy = false;

        $scope.user = null;

        $scope.showLoading = function () {
            processes++;
            updateStatus();
        };
        
        $scope.goToPurchaseHistory = function () {
            $location.path('/purchases-history');
        }

        $scope.hideLoading = function () {
            processes--;
            updateStatus();
        };

        $scope.homeUrl = '#/';

        $scope.signOut = function () {
            authSvc.logout();
        };

        $scope.init = function () {
            updateIsAuthenticated();
            if ($scope.isAuthenticated) {

                var currentUser = contextSvc.getCurrentUser();
                if (!currentUser) {
                    dataSvc.getLoggedEmployeeInfo().then(
                        function (result) {
                            $scope.user = result;
                            $scope.hideLoading();
                            contextSvc.setCurrentUser(result);
                        },
                        function (error) {
                            $scope.hideLoading();
                        });
                } else {
                    $scope.user = currentUser;
                    $scope.hideLoading();
                }

            } else {
                $scope.hideLoading();
            }
        };

        cleanupContainer.push($rootScope.$on(constants.userInfoUpdatedMessage, function () {
            $scope.init();
        }));

        $scope.showLoading();
        setTimeout(function() {
            $scope.init();
        }, 10);

        $scope.goToProfile = function () {
            $location.path('/profile');
        }
    }

}());
