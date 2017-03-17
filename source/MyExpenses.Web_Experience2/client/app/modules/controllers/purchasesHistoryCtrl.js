(function () {
    'use strict';

    angular.module('expensesApp').controller('PurchasesHistoryCtrl', [
        '$scope',
        'dataSvc',
        '$location',
        'constants',
        'toastrSvc',
        purchasesHistoryCtrl
    ]);

    function purchasesHistoryCtrl($scope, dataSvc, $location, constants, toastrSvc) {

        var cleanupContainer = [];

        $scope.historyItems = [];

        $scope.getPurchasesHistory = function () {
            $scope.showLoading();
            dataSvc.getPurchasesHistory().then(
                function (result) {
                    $scope.historyItems = result;
                    $scope.hideLoading();
                },
                function (error) {
                    // Manage error!
                    $scope.hideLoading();
                }
            );
        };

        cleanupContainer.push($scope.$on(constants.reportApprovedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has approved your report ' + expenseReportSequenceNumber, 'Report approved')
                .then(function () {
                    $location.path('/report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportRejectedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has rejected your report ' + expenseReportSequenceNumber, 'Report rejected')
                .then(function () {
                    $location.path('/report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has reimbursed your report ' + expenseReportSequenceNumber, 'Report reimbursed')
                .then(function () {
                    $location.path('/report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportSubmittedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('An employee has submitted a new expense report. Code: ' + expenseReportSequenceNumber, 'Report submitted')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('An employee has deleted an existing expense report. Code: ' + expenseReportSequenceNumber, 'Report deleted')
                .then(function () {
                    $location.path('/team-expenses');
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInCash, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('An employee has changed the payment method to cash in the report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInPoints, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('An employee has changed the payment method to company points in the report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportAddedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            toastrSvc.info('An employee has added a new expense in the submitted report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportModifiedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            toastrSvc.info('An employee has modified an expense in the submitted report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            toastrSvc.info('An employee has deleted an existing expense in the submitted report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on('$destroy', function () {

            angular.forEach(cleanupContainer, function (element) {
                element();
            });

        }));

        //Initialize company points
        $scope.getPurchasesHistory();
    }

}());
