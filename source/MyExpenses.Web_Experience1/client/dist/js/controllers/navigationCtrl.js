(function () {
    'use strict';

    angular.module('expensesApp').controller('NavigationCtrl', [
        '$scope',
        '$rootScope',
        '$route',
        'constants',
        'menuSvc',
        navigationCtrl
    ]);

    function navigationCtrl($scope, $rootScope, $route, constants, menuSvc) {

        var cleanupContainer = [];

        $scope.pages = [];

        $scope.currentController = null;

        cleanupContainer.push($rootScope.$on(constants.userInfoUpdatedMessage, function () {
            return menuSvc.getMenuOptions().then(function (pages) {
                $scope.pages = pages;
            });
        }));

        cleanupContainer.push($scope.$on('$routeChangeSuccess', function (event, current) {
            $scope.currentController = current.$$route.controller;
        }));

        $scope.isActive = function (page) {
            var isActive = false;
            for (var i = 0; i < page.controllers.length; i++) {
                if (page.controllers[i] === $scope.currentController) {
                    isActive = true;
                    break;
                }
            }
            return isActive;
        };

        cleanupContainer.push($scope.$on('$destroy', function () {

            angular.forEach(cleanupContainer, function (element) {
                element();
            });

        }));

    }

}());
