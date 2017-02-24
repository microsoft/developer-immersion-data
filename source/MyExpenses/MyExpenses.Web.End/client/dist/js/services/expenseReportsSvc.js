(function () {

    'use strict';

    angular.module('expensesApp').factory('expenseReportsSvc', [
        '$q',
        'dataSvc',
        'toastrSvc',
        'appInsights',
        expenseReportsSvc
    ]);

    function expenseReportsSvc($q, dataSvc, toastrSvc, appInsights) {

        function createReport(scope, newReport) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.createReport(newReport).then(
                function onSuccess(data) {
                    appInsights.logEvent('Expenses/ExpenseReports/Created');
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not create the report at this momment. Try again later.');
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function editReport(scope, sequenceNumber, updatedReport) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.updateReport(sequenceNumber, updatedReport).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not edit the report at this momment. Try again later.');
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function deleteReport(scope, report) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.deleteReport(report.sequenceNumber).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not delete the report at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        };

        function submitReportForApproval(scope, report) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.submitReportForApproval(report.sequenceNumber).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not submit the report for approval at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        function cloneReport(scope, report) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.cloneReport(report.sequenceNumber).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not clone the report at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        function chargeReportInPoints(scope, report) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.reimburseReportInPoints(report.sequenceNumber).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not change the expense report payment to points at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        function chargeReportInCash(scope, report) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.reimburseReportInCash(report.sequenceNumber).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('We can not change the expense report payment to cash at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        function approveReport(scope, report) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.approveReport(report.sequenceNumber).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('The expense report can not be approved at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        function rejectReport(scope, report, reason) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.rejectReport(report.sequenceNumber, { reason: reason }).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('The expense report can not be rejected at this momment. Try again later.');
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        }

        function reimburseReport(scope, report) {

            var deferred = $q.defer();
            scope.showLoading();

            dataSvc.reimburseReport(report.sequenceNumber).then(
                function onSuccess(data) {
                    scope.hideLoading();
                    deferred.resolve(data);
                },
                function onError(data) {
                    scope.hideLoading();
                    toastrSvc.error('The expense report can not be reimbursed at this momment. Try again later.');
                    deferred.reject(data);
                }
            );


            return deferred.promise;
        }

        var service = {
            createReport: createReport,
            editReport: editReport,
            deleteReport: deleteReport,
            submitReportForApproval: submitReportForApproval,
            cloneReport: cloneReport,
            chargeReportInPoints: chargeReportInPoints,
            chargeReportInCash: chargeReportInCash,
            approveReport: approveReport,
            rejectReport: rejectReport,
            reimburseReport: reimburseReport
        };

        return service;

    }

}());