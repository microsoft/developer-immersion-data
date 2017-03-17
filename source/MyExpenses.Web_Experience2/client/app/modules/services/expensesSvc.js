(function () {
    'use strict';

    angular.module('expensesApp').factory('expensesSvc', [
        '$q',
        'dataSvc',
        'toastrSvc',
        expensesSvc
    ]);

    function expensesSvc($q, dataSvc, toastrSvc) {

        function createExpense(scope, reportCode, newExpense) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.createExpense(reportCode, newExpense).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not create the expense at this momment. Try again later.');
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function editExpense(scope, reportCode, expenseId, updatedExpense) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.updateExpense(reportCode, expenseId, updatedExpense).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not update the expense at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        function deleteExpense(scope, reportCode, expense) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.deleteExpense(reportCode, expense.id).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not delete the expense at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        var service = {
            createExpense: createExpense,
            editExpense: editExpense,
            deleteExpense: deleteExpense
        };

        return service;

    }
}());