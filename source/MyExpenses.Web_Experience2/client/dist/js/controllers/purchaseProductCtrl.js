(function () {
    'use strict';

    angular.module('expensesApp').controller('PurchaseProductCtrl', [
        '$scope',
        '$uibModalInstance',
        'authSvc',
        'model',
        purchaseProductCtrl
    ]);

    function purchaseProductCtrl($scope, $uibModalInstance, authSvc, model) {

        function generateImageUrl(productId) {
            return '/api/products/' + productId + '/picture?pictureType=2&access_token=' + authSvc.getAuthToken();
        }

        function onUnitsChanged() {
            var currentPoints = $scope.model.currentPoints;
            var price = $scope.model.price;
            var units = $scope.model.units;

            $scope.finalPrice = (price * units);
            $scope.pointsAfterPurchase = (currentPoints - $scope.finalPrice);

            if ($scope.pointsAfterPurchase < 0) {
                $scope.notEnoughPoints = true;
            } else {
                if ($scope.notEnoughPoints === true) {
                    $scope.notEnoughPoints = false;
                }
            }
        }

        $scope.submitted = false;

        $scope.notEnoughPoints = false;

        $scope.model = model;

        $scope.largeImageUrl = model.pictureUrl || generateImageUrl(model.id);

        $scope.finalPrice = 0;

        $scope.pointsAfterPurchase = 0;

        $scope.$watch('model.units', function (newValue, oldValue) {
            if (newValue > 0) {
                onUnitsChanged();
            }
        });

        $scope.confirm = function (form) {

            if (!$scope.submitted) {
                $scope.submitted = true;
            }

            if (form.$valid) {
                $uibModalInstance.close($scope.model);
            }

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }
})();
