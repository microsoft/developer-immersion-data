(function () {
    'use strict';

    angular.module('expensesApp').controller('ReportCtrl', [
        '$scope',
        '$routeParams',
        '$location',
        '$q',
        'dataSvc',
        'expenseReportsSvc',
        'expensesSvc',
        'toastrSvc',
        'dialogSvc',
        'constants',
        'settings',
        reportCtrl
    ]);

    function reportCtrl($scope, $routeParams, $location, $q, dataSvc, expenseReportsSvc, expensesSvc, toastrSvc, dialogSvc, constants, settings) {

        var cleanupContainer = [];

        function setSwichPaymentFormText() {

            if ($scope.report.status === 'Unavailable') {
                $scope.swichPaymentFormText = '';
            } else {
                if ($scope.report.chargedInPoints) {
                    $scope.swichPaymentFormText = 'Reimburse in cash';
                } else {
                    $scope.swichPaymentFormText = 'Reimburse in points';
                }
            }

        }

        function loadCostCenters() {

            $scope.showLoading();

            dataSvc.getCostCenters().then(
                function (result) {

                    $scope.costCenters = result;

                    for (var i = 0; i < $scope.costCenters.length; i++) {
                        var current = $scope.costCenters[i];
                        if (current.id === $scope.report.costCenterId) {
                            $scope.report.costCenter = current;
                            break;
                        }
                    }

                    $scope.hideLoading();
                },
                function (error) {
                    $scope.hideLoading();
                }
            );

        }

        function buildExpenseCreationModel() {

            var deferred = $q.defer();
            $scope.showLoading();

            dataSvc.getExpenseCategories().then(
                function onSuccess(categories) {
                    $scope.hideLoading();

                    var newExpense = {
                        mode: 'new',
                        title: '',
                        notes: '',
                        amount: 0,
                        date: moment().format(settings.dateFormat),
                        recurrentFrom: '',
                        recurrentTo: '',
                        expenseCategories: categories,
                        expenseCategory: null,
                        picture: null
                    };

                    deferred.resolve(newExpense);
                },
                function () {
                    $scope.hideLoading();
                    toastrSvc.error('We can not create the expense at this momment. Try again later.');
                    deferred.reject();
                });

            return deferred.promise;
        }

        function buildExpenseEditionModel(reportCode, expenseId) {

            var deferred = $q.defer();
            $scope.showLoading();

            $q.all([
                dataSvc.getExpenseCategories(),
                dataSvc.getExpense(reportCode, expenseId)
            ]).then(
                function (results) {
                    $scope.hideLoading();

                    var expenseCategories = results[0];
                    var currentExpense = results[1];
                    var currentExpenseCategory = null;

                    for (var i = 0; i < expenseCategories.length; i++) {
                        if (expenseCategories[i].id === currentExpense.categoryId) {
                            currentExpenseCategory = expenseCategories[i];
                            break;
                        }
                    }

                    var model = {
                        mode: 'edit',
                        title: currentExpense.title,
                        notes: currentExpense.notes,
                        amount: currentExpense.amount,
                        date: currentExpense.date,
                        recurrentFrom: currentExpense.recurrentFrom,
                        recurrentTo: currentExpense.recurrentTo,
                        expenseCategories: expenseCategories,
                        expenseCategory: currentExpenseCategory,
                        picture: currentExpense.receipt
                    };

                    deferred.resolve(model);
                },
                function () {
                    $scope.hideLoading();
                    toastrSvc.error('We can not edit the expense at this momment. Try again later.');
                    deferred.reject();
                });

            return deferred.promise;
        }

        $scope.reportCode = $routeParams.reportCode;

        $scope.report = { status: 'Unavailable' };

        $scope.costCenters = [];

        $scope.expenses = [];

        $scope.reportUpdateSubmitted = false;

        $scope.searchtext = { query : '' };

        $scope.loadReport = function () {

            $scope.showLoading();

            dataSvc.getReportDetail($scope.reportCode).then(
                function (result) {
                    $scope.report = result;

                    if ($scope.report.statusId === 0) {
                        loadCostCenters();
                    }

                    setSwichPaymentFormText();
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

            dataSvc.getExpenses($scope.reportCode, $scope.searchtext.query).then(
                function (result) {
                    result.forEach(function (exp) {
                        exp.receiptUrl = exp.receiptUrl + '?' + new Date().getTime();
                    });
                  
                    $scope.expenses = result;
                    $scope.hideLoading();
                },
                function (error) {
                    // Manage error!
                    $scope.hideLoading();
                }
            );

        };

        $scope.search = function () {

            $scope.loadExpenses();

        };

        $scope.urlToReportsList = '#/';

        $scope.showExpenseDetail = function (expense) {
            if (!expense.details) {
                $scope.showLoading();
                dataSvc.getExpenseDetails($scope.reportCode, expense.id).then(
                    function (result) {
                        expense.details = result;
                        expense.showDetails = true;
                        $scope.hideLoading();
                    },
                    function (error) {
                        // Manage error!
                        console.log(error);
                        $scope.hideLoading();
                    }
                );
            } else {
                expense.showDetails = !expense.showDetails;
            }
        };

        $scope.editReport = function (reportForm) {

            if (!$scope.reportUpdateSubmitted) {
                $scope.reportUpdateSubmitted = true;
            }

            if (reportForm.$valid) {

                var updatedReport = {
                    purpose: $scope.report.purpose,
                    description: $scope.report.description,
                    costCenterId: $scope.report.costCenter.id
                };

                expenseReportsSvc.editReport($scope, $scope.reportCode, updatedReport).then(
                    function onReportEdited(data) {
                        // Report succesfully updated
                        $scope.reportUpdateSubmitted = false;
                        toastrSvc.info('Report updated');
                    }
                );

            }

        };

        $scope.deleteReport = function () {

            var message = 'Are you sure you want to permanently delete the report <strong>' + $scope.report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, delete', message, 'Delete report').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.deleteReport($scope, $scope.report).then(
                        function onSuccess(data) {
                            $location.path('/');
                        });

                });

        };

        $scope.submitReportForAproval = function () {

            var message = 'Are you sure you want to submit the report <strong>' + $scope.report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, submit', message, 'Submit report for approval').then(
                function onDialogConfirmed(data) {

                    expenseReportsSvc.submitReportForApproval($scope, $scope.report).then(
                        function onReportSubmitted(data) {
                            $scope.loadReport();
                        });

                });

        };

        $scope.cloneReport = function () {

            var message = 'Are you sure you want to clone the report <strong>' + $scope.report.purpose + '</strong>?';

            dialogSvc.confirmation('Yes, clone', message, 'Clone report').then(
                function onDialogConfirmed(data) {

                    $scope.showLoading();

                    expenseReportsSvc.cloneReport($scope, $scope.report).then(
                        function onReportCloned(data) {
                            $scope.hideLoading();

                            $scope.loadReport();
                           

                        }).catch(function () {

                            $scope.hideLoading();

                        });

                });

        };

        $scope.swichPaymentFormText = '';

        $scope.swichPaymentForm = function () {

            var message;

            if ($scope.report.chargedInPoints) {

                message = 'Are you sure you want to change the payment method to cash to the report <strong>' + $scope.report.purpose + '</strong>?';

                dialogSvc.confirmation('Yes', message, 'Reimburse report in cash')
                    .then(
                        function onSuccess(data) {
                            return expenseReportsSvc.chargeReportInCash($scope, $scope.report);
                        })
                    .then(
                        function onSuccess(data) {
                            $scope.report.swichPaymentForm();
                            setSwichPaymentFormText();
                        }
                );

            } else {

                message = 'Are you sure you want to change the payment method to points to the report <strong>' + $scope.report.purpose + '</strong>?';

                dialogSvc.confirmation('Yes', message, 'Reimburse report in points')
                    .then(
                        function onSuccess(data) {
                            return expenseReportsSvc.chargeReportInPoints($scope, $scope.report);
                        })
                    .then(
                        function onSuccess(data) {
                            $scope.report.swichPaymentForm();
                            setSwichPaymentFormText();
                        }
                    );

            }

        };

        $scope.createExpense = function () {

            buildExpenseCreationModel().then(
                function onModelCreated(data) {

                    var config = {
                        view: 'CreateEditExpense.html',
                        controller: 'CreateEditExpenseCtrl',
                        size: 'l'
                    };

                    dialogSvc.dialog(config, data).then(
                        function onDialogConfirmed(data) {

                            $scope.showLoading();

                            var expense = {
                                title: data.title,
                                notes: data.notes,
                                amount: data.amount,
                                date: data.date,
                                ecurrentFrom: data.recurrentFrom,
                                recurrentTo: data.recurrentTo,
                                categoryId: data.expenseCategory.id,
                                receipt: data.picture
                            };

                            expensesSvc.createExpense($scope, $scope.reportCode, expense).then(
                                function onExpenseCreated(data) {
                                    $scope.hideLoading();

                                    $scope.loadReport();
                                    $scope.loadExpenses();
                                }).catch(function () {
                                    $scope.hideLoading();
                                });

                        });

                });

        };

        $scope.editExpense = function (expense) {

            buildExpenseEditionModel($scope.reportCode, expense.id).then(
                function onModelCreated(data) {

                    var config = {
                        view: 'CreateEditExpense.html',
                        controller: 'CreateEditExpenseCtrl'
                    };

                    dialogSvc.dialog(config, data).then(
                        function onDialogConfirmed(data) {

                            $scope.showLoading();

                            var updatedExpense = {
                                title: data.title,
                                notes: data.notes,
                                amount: data.amount,
                                date: data.date,
                                recurrentFrom: data.recurrentFrom,
                                recurrentTo: data.recurrentTo,
                                categoryId: data.expenseCategory.id,
                                receipt: data.picture
                            };

                            expensesSvc.editExpense($scope, $scope.reportCode, expense.id, updatedExpense).then(
                                function onExpenseUpdated(data) {
                                    $scope.hideLoading();

                                    $scope.loadReport();
                                    $scope.loadExpenses();
                                }).catch(function () {

                                    $scope.hideLoading();

                                });

                        });

                });

        };

        $scope.deleteExpense = function (expense) {

            var message = 'Are you sure you want to permanently delete the expense <strong>' + expense.title + '</strong>?';

            dialogSvc.confirmation('Yes, delete', message, 'Delete expense').then(
                function onDialogConfirmed(data) {

                    expensesSvc.deleteExpense($scope, $scope.reportCode, expense).then(
                        function onExpenseDeleted(result) {
                            $scope.loadReport();
                            $scope.loadExpenses();
                        }
                    );

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
                        $location.path('/report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportRejectedMessage, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                toastrSvc.info('This report has been rejected.');
                $scope.loadReport();
            } else {
                toastrSvc.info('Your manager has rejected your report ' + expenseReportSequenceNumber, 'Report rejected')
                    .then(function () {
                        $location.path('/report/' + expenseReportSequenceNumber);
                    });
            }

        }));

        cleanupContainer.push($scope.$on(constants.reportReimbursedMessage, function (event, expenseReportSequenceNumber) {

            if ($scope.reportCode === expenseReportSequenceNumber) {
                toastrSvc.info('This report has been reimbursed.');
                $scope.loadReport();
            } else {
                toastrSvc.info('Your manager has reimbursed your report ' + expenseReportSequenceNumber, 'Report reimbursed')
                    .then(function () {
                        $location.path('/report/' + expenseReportSequenceNumber);
                    });
            }

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
                    $location.path('/team-report/' + expenseReportSequenceNumber);
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
            toastrSvc.info('An employee has deleted an existing expense in the submitted report ' + expenseReportSequenceNumber)
                .then(function () {
                    $location.path('/team-report/' + expenseReportSequenceNumber);
                });

        }));

        cleanupContainer.push($scope.$on('$destroy', function () {

            angular.forEach(cleanupContainer, function (element) {
                element();
            });

        }));

        $scope.init();
    }
}());
