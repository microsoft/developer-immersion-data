(function () {
    'use strict';

    angular.module('expensesApp').controller('RejectReportCtrl', [
        '$scope',
        '$uibModalInstance',
        'model',
        rejectReportCtrl
    ]);

    function rejectReportCtrl($scope, $uibModalInstance, model) {

        $scope.title = 'Report rejection';

        $scope.saveText = 'Reject';

        $scope.model = model;

        $scope.submitted = false;

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
}());
