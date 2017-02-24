(function () {
    'use strict';

    angular.module('expensesApp').controller('ReportsListCtrl', [
        '$scope',
        '$location',
        '$q',
        'constants',
        'dataSvc',
        'toastrSvc',
        'dialogSvc',
        'expenseReportsSvc',
        reportsListCtrl
    ]);

    function reportsListCtrl($scope, $location, $q, constants, dataSvc, toastrSvc, dialogSvc, expenseReportsSvc) {

        function notifyAndRefreshCurrentPage() {
            $scope.$emit(constants.reportsStatusesChangedMessage);
            $scope.navigateToPage($scope.paginationInfo.pageIndex);
        }

        function buildExpenseReportCreationModel() {

            var deferred = $q.defer();
            $scope.showLoading();

            dataSvc.getCostCenters().then(
                function onSuccess(costCenters) {
                    $scope.hideLoading();

                    var model = {
                        mode: 'new',
                        purpose: '',
                        description: '',
                        costCenters: costCenters,
                        costCenter: null
                    };

                    deferred.resolve(model);
                },
                function () {
                    $scope.hideLoading();
                    toastrSvc.error('We can not get the cost centers at this momment. Try again later.');
                    deferred.reject();
                });

            return deferred.promise;
        }

        var cleanupContainer = [];

        $scope.currentStatus = -1;

        $scope.query = '';

        $scope.reports = [];

        $scope.pages = [];

        $scope.paginationInfo = { totalCount: 0 };

        $scope.navigateToPage = function (pageIndex) {
            $scope.showLoading();
            dataSvc.getReports($scope.currentStatus, $scope.query, pageIndex).then(
                function (result) {
                    $scope.reports = result.items;
                    $scope.pages = result.pages;
                    $scope.paginationInfo = result.paginationInfo;
                    $scope.hideLoading();
                },
                function (error) {
                    // Manage error!
                    $scope.hideLoading();
                }
            );
        };

        $scope.search = function () {
            $scope.navigateToPage(0);
        };

        $scope.previousPage = function () {
            if ($scope.paginationInfo.hasPreviousPage) {
                $scope.navigateToPage($scope.paginationInfo.pageIndex - 1);
            }
        };

        $scope.nextPage = function () {
            if ($scope.paginationInfo.hasNextPage) {
                $scope.navigateToPage($scope.paginationInfo.pageIndex + 1);
            }
        };

        $scope.toggleReportSummary = function (report) {
            if (!report.details) {
                $scope.showLoading();
                dataSvc.getReportSummary(report.sequenceNumber).then(
                    function (result) {
                        report.details = result;
                        report.showDetails = true;
                        $scope.hideLoading();
                    },
                    function (error) {
                        // Manage error!
                        console.log(error);
                        $scope.hideLoading();
                    });
            } else {
                report.showDetails = !report.showDetails;
            }
        };

        $scope.createReport = function () {

            buildExpenseReportCreationModel().then(
                function modelCreated(data) {

                    var config = {
                        view: 'CreateEditReport.html',
                        controller: 'CreateEditReportCtrl'
                    };

                    dialogSvc.dialog(config, data).then(
                        function onDialogConfirmed(data) {

                            var report = {
                                purpose: data.purpose,
                                description: data.description,
                                costCenterId: data.costCenter.id
                            };

                            expenseReportsSvc.createReport($scope, report).then(
                                function onReportCreated(data) {
                                    // Notify and refresh the current view
                                    $scope.$emit(constants.reportsStatusesChangedMessage);
                                    $scope.navigateToPage($scope.paginationInfo.pageIndex);
                                });
                        });

                });

        };

        $scope.deleteReport = function (report) {

            var message = 'Are you sure you want to permanently delete the report <strong>' + report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, delete', message, 'Delete report').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.deleteReport($scope, report).then(
                        function onReportDeleted(data) {
                            notifyAndRefreshCurrentPage();
                        });

                });

        };

        $scope.submitForAproval = function (report) {

            var message = 'Are you sure you want to submit the report <strong>' + report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, submit', message, 'Submit report for approval').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.submitReportForApproval($scope, report).then(
                        function onReportSubmitted(data) {
                            notifyAndRefreshCurrentPage();
                        });

                });

        };

        $scope.clone = function (report) {

            var message = 'Are you sure you want to clone the report <strong>' + report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, clone', message, 'Clone report').then(
                function onDialogConfirmed(data) {
                    $scope.showLoading();
                    expenseReportsSvc.cloneReport($scope, report).then(
                        function onSuccess(data) {
                            $scope.hideLoading();
                            notifyAndRefreshCurrentPage();
                        });

                });

        };

        $scope.chargeInPoints = function (report) {

            var message = 'Are you sure you want to charge in points the report <strong>' + report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, charge in points', message, 'Charge report in points').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.chargeReportInPoints($scope, report).then(
                        function onSuccess(data) {
                            notifyAndRefreshCurrentPage();
                        });

                });

        };

        $scope.showDelete = function (report) { 
            return (report.status === 'Unsubmitted' || report.status === 'Submitted');
        }

        cleanupContainer.push($scope.$on(constants.reportStatusNavigatedMessage, function (event, statusId) {
            $scope.currentStatus = statusId;
            $scope.navigateToPage(0);
        }));

        cleanupContainer.push($scope.$on(constants.reportApprovedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has approved your report ' + expenseReportSequenceNumber, 'Report approved')
                .then(function () {
                    notifyAndRefreshCurrentPage();
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportRejectedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has rejected your report ' + expenseReportSequenceNumber, 'Report rejected')
                .then(function () {
                    notifyAndRefreshCurrentPage();
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has reimbursed your report ' + expenseReportSequenceNumber, 'Report reimbursed')
                .then(function () {
                    notifyAndRefreshCurrentPage();
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportSubmittedMessage, function (event, expenseReportSequenceNumber) {

            // Only received if current user is manager
            toastrSvc.info('An employee has submitted a new expense report. Code: ' + expenseReportSequenceNumber, 'Report submitted')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedMessage, function (event, expenseReportSequenceNumber) {

            // Only received if current user is manager
            toastrSvc.info('An employee has deleted an existing expense report. Code: ' + expenseReportSequenceNumber, 'Report deleted')
                .then(function () {
                    $location.path('/team-expenses');
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInCash, function (event, expenseReportSequenceNumber) {

            // Only received if current user is manager
            toastrSvc.info('An employee has changed the payment method to cash in the report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInPoints, function (event, expenseReportSequenceNumber) {

            // Only received if current user is manager
            toastrSvc.info('An employee has changed the payment method to company points in the report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportAddedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            // Only received if current user is manager
            toastrSvc.info('An employee has added a new expense in the submitted report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportModifiedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            // Only received if current user is manager
            toastrSvc.info('An employee has modified an expense in the submitted report ' + expenseReportSequenceNumber, '')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            // Only received if current user is manager
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

        // load the first page
        $scope.navigateToPage(0);

    }
}());
