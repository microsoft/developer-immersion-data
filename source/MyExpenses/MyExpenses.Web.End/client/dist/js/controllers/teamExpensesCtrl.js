(function () {
    'use strict';

    angular.module('expensesApp').controller('TeamExpensesCtrl', [
        '$scope',
        'constants',
        'dataSvc',
        'toastrSvc',
        'dialogSvc',
        'expenseReportsSvc',
        teamExpensesCtrl
    ]);

    function teamExpensesCtrl($scope, constants, dataSvc, toastrSvc, dialogSvc, expenseReportsSvc) {

        var cleanupContainer = [];

        function updateReportTotalAndPoints(expenseReportSequenceNumber) {

            dataSvc.getReportDetail(expenseReportSequenceNumber).then(
                function (data) {
                    for (var i = 0; i < $scope.reports.length; i++) {
                        var currentReport = $scope.reports[i];
                        if (currentReport.sequenceNumber === expenseReportSequenceNumber) {
                            currentReport.total = data.total;
                            currentReport.points = data.points;
                            break;
                        }
                    }
                }
            );

        }

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

        function setChargeinPointsToReport(expenseReportSequenceNumber, chargeInPoints) {

            for (var i = 0; i < $scope.reports.length; i++) {
                var currentReport = $scope.reports[i];
                if (currentReport.sequenceNumber === expenseReportSequenceNumber) {
                    $scope.$apply(function () {
                        currentReport.chargeInPoints = chargeInPoints;
                    });
                    break;
                }
            }

        }

        $scope.currentStatus = -1;

        $scope.query = '';

        $scope.reports = [];

        $scope.pages = [];

        $scope.paginationInfo = { totalCount: 0 };

        $scope.navigateToPage = function (pageIndex) {
            $scope.showLoading();
            dataSvc.getTeamPendingReports($scope.currentStatus, $scope.query, pageIndex).then(
                function (result) {
                    $scope.reports = result.items;
                    $scope.pages = result.pages;
                    result.paginationInfo.totalCount = result.items.length;
                    $scope.paginationInfo = result.paginationInfo;
                    $scope.hideLoading();
                },
                function (error) {
                    // Manage error!
                    console.log(error);
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

        $scope.showReportSummary = function (report) {
            report.showDetails = !report.showDetails;
        };

        $scope.approveReport = function (report) {

            var message = 'Are you sure you want to approve the report <strong>' + report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, approve', message, 'Approve report').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.approveReport($scope, report).then(
                        function onSuccess(data) {
                            // Notify and refresh the current view
                            $scope.$emit(constants.teamReportsStatusesChangedMessage);
                            $scope.navigateToPage($scope.paginationInfo.pageIndex);

                        });

                });

        };

        $scope.rejectReport = function (report) {

            var model = {
                reason: ''
            };

            var config = {
                view: 'RejectReport.html',
                controller: 'RejectReportCtrl'
            };

            dialogSvc.dialog(config, model).then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.rejectReport($scope, report, data.reason).then(
                        function onReportRejected(data) {
                            // Notify and refresh the current view
                            $scope.$emit(constants.teamReportsStatusesChangedMessage);
                            $scope.navigateToPage($scope.paginationInfo.pageIndex);
                        });

                });

        };

        $scope.reimburseReport = function (report) {

            var message = 'Are you sure you want to reimburse the report <strong>' + report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, reimburse', message).then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.reimburseReport($scope, report).then(
                        function onSuccess(data) {
                            // Notify and refresh the current view
                            $scope.$emit(constants.teamReportsStatusesChangedMessage);
                            $scope.navigateToPage($scope.paginationInfo.pageIndex);
                        });

                });

        };

        cleanupContainer.push($scope.$on(constants.reportStatusNavigatedMessage, function (event, statusId) {
            $scope.currentStatus = statusId;
            $scope.navigateToPage(0);
        }));

        cleanupContainer.push($scope.$on(constants.reportApprovedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has approved your report ' + expenseReportSequenceNumber, 'Report approved');

        }));

        cleanupContainer.push($scope.$on(constants.reportRejectedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has rejected your report ' + expenseReportSequenceNumber, 'Report approved');

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('Your manager has reimbursed your report ' + expenseReportSequenceNumber, 'Report approved');

        }));

        cleanupContainer.push($scope.$on(constants.reportSubmittedMessage, function (event, expenseReportSequenceNumber) {

            $scope.$emit(constants.teamReportsStatusesChangedMessage);
            $scope.navigateToPage($scope.paginationInfo.pageIndex);
            toastrSvc.info('An employee has submitted a new expense report. Code: ' + expenseReportSequenceNumber, 'Report submitted');

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedMessage, function (event, expenseReportSequenceNumber) {

            $scope.$emit(constants.teamReportsStatusesChangedMessage);
            $scope.navigateToPage($scope.paginationInfo.pageIndex);
            toastrSvc.info('An employee has deleted an existing expense report. Code: ' + expenseReportSequenceNumber, 'Report deleted');

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInCash, function (event, expenseReportSequenceNumber) {

            setChargeinPointsToReport(expenseReportSequenceNumber, false);
            toastrSvc.info('An employee has changed the payment method to cash in the report ' + expenseReportSequenceNumber, '');

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInPoints, function (event, expenseReportSequenceNumber) {

            setChargeinPointsToReport(expenseReportSequenceNumber, true);
            toastrSvc.info('An employee has changed the payment method to company points in the report ' + expenseReportSequenceNumber, '');

        }));

        cleanupContainer.push($scope.$on(constants.reportAddedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            updateReportTotalAndPoints(expenseReportSequenceNumber);
            toastrSvc.info('An employee has added a new expense in the submitted report ' + expenseReportSequenceNumber, '');

        }));

        cleanupContainer.push($scope.$on(constants.reportModifiedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            updateReportTotalAndPoints(expenseReportSequenceNumber);
            toastrSvc.info('An employee has modified an expense in the submitted report ' + expenseReportSequenceNumber, '');

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            updateReportTotalAndPoints(expenseReportSequenceNumber);
            toastrSvc.info('An employee has deleted an existing expense in the submitted report ' + expenseReportSequenceNumber, '');

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
