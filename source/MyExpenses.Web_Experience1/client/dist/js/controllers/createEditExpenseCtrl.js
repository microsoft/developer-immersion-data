(function () {
    'use strict';

    angular.module('expensesApp').controller('CreateEditExpenseCtrl', [
        '$scope',
        '$uibModalInstance',
        'model',
        createExpenseCtrl
    ]);

    function createExpenseCtrl($scope, $uibModalInstance, model) {

        function adjustRecurrentInformation(expense, isRecurrent) {
            if (isRecurrent === false) {
                expense.recurrentFrom = '';
                expense.recurrentTo = '';
            }
        };

        function getTitle(editModel) {
            if (editModel.mode === 'edit') {
                return editModel.title;
            } else {
                return 'New expense';
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

        $scope.isRecurrent = { value: false };

        $scope.setDefaultAmount = function () {
            if ($scope.model.expenseCategory && ($scope.model.amount === undefined || $scope.model.amount <= 0)) {
                $scope.model.amount = $scope.model.expenseCategory.defaultAmount;
            }
        };

        if (model.recurrentFrom) {
            $scope.isRecurrent.value = true;
        }

        $scope.confirm = function (form) {
            if (!$scope.submitted) {
                $scope.submitted = true;
            }

            if (form.$valid) {
                adjustRecurrentInformation($scope.model, $scope.isRecurrent.value);
                $uibModalInstance.close($scope.model);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }
}());
