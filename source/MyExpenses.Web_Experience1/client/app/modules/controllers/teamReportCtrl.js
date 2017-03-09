(function () {
    'use strict';

    angular.module('expensesApp').controller('TeamReportCtrl', [
        '$scope',
        '$routeParams',
        '$q',
        '$location',
        'constants',
        'dataSvc',
        'dialogSvc',
        'expenseReportsSvc',
        'toastrSvc',
        reportCtrl
    ]);

    function reportCtrl($scope, $routeParams, $q, $location, constants, dataSvc, dialogSvc, expenseReportsSvc, toastrSvc) {

        var cleanupContainer = [];

        $scope.reportCode = $routeParams.reportCode;

        $scope.report = { status: 'Unavailable' };

        $scope.expenses = [];

        $scope.query = '';

        $scope.loadReport = function () {
            $scope.showLoading();
            dataSvc.getReportDetail($scope.reportCode).then(
                function (result) {
                    $scope.report = result;
                    $scope.hideLoading();
                },
                function (error) {
                    // Manage error!
                    $scope.hideLoading();
                }
            );
        };

        $scope.loadExpenses = function () {
            $scope.showLoading();
            dataSvc.getExpenses($scope.reportCode, $scope.query).then(
                function (result) {
                    $scope.expenses = result;
                    $scope.hideLoading();
                },
                function (error) {
                    $scope.hideLoading();
                }
            );
        };

        $scope.search = function () {
            $scope.loadExpenses();
        };

        $scope.urlToReportsList = '#/team-expenses';

        $scope.showExpenseDetail = function (expense) {
            if (!expense.details) {
                dataSvc.getExpenseDetails($scope.reportCode, expense.id).then(
                    function (result) {
                        expense.details = result;
                        expense.showDetails = true;
                    },
                    function (error) {
                        // Manage error!
                        console.log(error);
                    }
                );
            } else {
                expense.showDetails = !expense.showDetails;
            }
        };

        $scope.approveReport = function () {

            var message = 'Are you sure you want to approve the report <strong>' + $scope.report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, approve', message, 'Approve report').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.approveReport($scope, $scope.report).then(
                        function onReportApproved(data) {
                            $scope.loadReport();
                        });

                });

        };

        $scope.rejectReport = function () {

            var model = {
                reason: ''
            };

            var config = {
                view: 'RejectReport.html',
                controller: 'RejectReportCtrl'
            };

            dialogSvc.dialog(config, model).then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.rejectReport($scope, $scope.report, data.reason).then(
                        function onSuccess(data) {
                            // Navigate to team reports list. Report no longer visible by the manager.
                            $location.path('/team-expenses');
                        });

                });

        };

        $scope.reimburseReport = function () {

            var message = 'Are you sure you want to reimburse the report <strong>' + $scope.report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, reimburse', message, 'Reimburse report').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.reimburseReport($scope, $scope.report).then(
                        function onSuccess(data) {
                            // Navigate to team reports list. Report is no longer visible by the manager.
                            $location.path('/team-expenses');
                        });

                });

        };

        $scope.init = function () {
            $scope.loadReport();
            $scope.loadExpenses();
        };

        cleanupContainer.push($scope.$on(constants.reportApprovedMessage, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                toastrSvc.info('This report has been approved.');
                $scope.loadReport();
            } else {
                toastrSvc.info('Your manager has approved your report ' + expenseReportSequenceNumber, 'Report approved')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportRejectedMessage, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                toastrSvc.info('This report has been rejected.');
                $scope.loadReport();
            } else {
                toastrSvc.info('Your manager has rejected your report ' + expenseReportSequenceNumber, 'Report approved')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedMessage, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                toastrSvc.info('This report has been reimbursed.');
                $scope.loadReport();
            } else {
                toastrSvc.info('Your manager has reimbursed your report ' + expenseReportSequenceNumber, 'Report approved')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportSubmittedMessage, function (event, expenseReportSequenceNumber) {

            toastrSvc.info('An employee has submitted a new expense report. Code: ' + expenseReportSequenceNumber, 'Report submitted')
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedMessage, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                toastrSvc.info('This report has been deleted by his owner.');
                $scope.$apply(function () {
                    $location.path('/team-expenses');
                });
            } else {
                toastrSvc.info('An employee has deleted an existing expense report. Code: ' + expenseReportSequenceNumber, 'Report deleted')
                    .then(function () {
                        $location.path('/team-expenses');
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInCash, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                $scope.$apply(function () {
                    $scope.report.chargedIn = 'Cash';
                });
                toastrSvc.info('The report owner would reimburse this report in cash');
            } else {
                toastrSvc.info('An employee has changed the payment method to cash in the report ' + expenseReportSequenceNumber, '')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedInPoints, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                $scope.$apply(function () {
                    $scope.report.chargedIn = 'Points';
                });
                toastrSvc.info('The report owner would reimburse this report in company points');
            } else {
                toastrSvc.info('An employee has changed the payment method to company points in the report ' + expenseReportSequenceNumber, '')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportAddedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            if ($scope.reportCode === expenseReportSequenceNumber) {

                $q.all([
                    dataSvc.getReportDetail($scope.reportCode),
                    dataSvc.getExpenseInfo($scope.reportCode, expenseId)
                ]).then(function onSuccess(data) {
                    var updatedReport = data[0];
                    $scope.report.total = updatedReport.total;
                    $scope.report.points = updatedReport.points;
                    $scope.expenses.push(data[1]);
                    toastrSvc.info('A new expense has been added');
                });

            } else {
                toastrSvc.info('An employee has added a new expense in the submitted report ' + expenseReportSequenceNumber, '')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        function indexOfExpense(expenseId) {
            var index = -1;
            for (var i = 0; i < $scope.expenses.length; i++) {
                if ($scope.expenses[i].id === expenseId) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        cleanupContainer.push($scope.$on(constants.reportModifiedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            if ($scope.reportCode === expenseReportSequenceNumber) {

                $q.all([
                    dataSvc.getReportDetail($scope.reportCode),
                    dataSvc.getExpenseInfo($scope.reportCode, expenseId)
                ]).then(function onSuccess(data) {
                    var updatedReport = data[0];
                    $scope.report.total = updatedReport.total;
                    $scope.report.points = updatedReport.points;
                    var index = indexOfExpense(expenseId);
                    if (index > -1) {
                        $scope.expenses.splice(index, 1, data[1]);
                    }
                    toastrSvc.info('An expense has been modiffied');
                });

            } else {
                toastrSvc.info('An employee has modified an expense in the submitted report ' + expenseReportSequenceNumber, '')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportDeletedExpense, function (event, expenseReportSequenceNumber, expenseId) {

            if ($scope.reportCode === expenseReportSequenceNumber) {

                dataSvc.getReportDetail($scope.reportCode).then(
                    function (data) {
                        $scope.report.total = data.total;
                        $scope.report.points = data.points;
                        var index = indexOfExpense(expenseId);
                        if (index > -1) {
                            $scope.expenses.splice(index, 1);
                        }
                        toastrSvc.info('An expense has been deleted');
                    });

            } else {
                toastrSvc.info('An employee has deleted an existing expense in the submitted report ' + expenseReportSequenceNumber, '')
                    .then(function () {
                        $location.path('/team-report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on('$destroy', function () {

            angular.forEach(cleanupContainer, function (element) {
                element();
            });

        }));

        $scope.init();
    }
}());
