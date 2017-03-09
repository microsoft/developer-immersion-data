(function () {
    'use strict';

    angular.module('expensesApp').controller('CreateEditReportCtrl', [
        '$scope',
        '$uibModalInstance',
        'model',
        createReportCtrl
    ]);

    function createReportCtrl($scope, $uibModalInstance, model) {

        function getTitle(editModel) {
            if (editModel.mode === 'edit') {
                return editModel.sequenceNumber + ': ' + editModel.purpose;
            } else {
                return 'New report';
            }
        };

        function getSaveText(mode) {
            if (mode === 'edit') {
                return 'Save';
            } else {
                return 'Create';
            }
        };

        $scope.title = getTitle(model);

        $scope.saveText = getSaveText(model.mode);

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
