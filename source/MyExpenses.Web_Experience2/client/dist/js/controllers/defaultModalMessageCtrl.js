(function () {
    'use strict';

    angular.module('expensesApp').controller('DefaultModalMessageCtrl', [
        '$scope',
        '$uibModalInstance',
        'model',
        defaultModalMessageCtrl
    ]);

    function defaultModalMessageCtrl($scope, $uibModalInstance, model) {

        $scope.title = model.title;

        $scope.message = model.message;

        $scope.options = model.options;

        $scope.selectOption = function (option) {
            $uibModalInstance.close(option);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }
}());
