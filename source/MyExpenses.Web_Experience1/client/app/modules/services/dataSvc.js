(function () {
    'use strict';

    angular.module('expensesApp').factory('dataSvc_des', [
        '$http',
        '$q',
        'loggerSvc',
        'modelSvc',
        'settings',
        dataSvc
    ]);

    function dataSvc($http, $q, loggerSvc, modelSvc, settings) {

        function log(msg, data) {
            loggerSvc.log(msg, data, 'dataSvc');
        }

        function handleError(deferred, data, message) {

            var errorMessage = (data && data.Message) || data;

            if (errorMessage) {
                log(message + ': ' + errorMessage);
                deferred.reject(errorMessage);
            } else {
                log(message);
                deferred.reject();
            }
        }

        function version2Header(data, headersGetter) {
            var headers = headersGetter();
            headers['X-Api-Version'] = '2';
        }

        function getLoggedEmployeeInfo() {

            var deferred = $q.defer();

            $http.get('api/employees/current')
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.Employee(data);
                    log('Retrieved employee from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving employee from remote data source');
                });

            return deferred.promise;
        }

        function getReports(status, filter, pageIndex) {

            var deferred = $q.defer();

            var config = {
                params: {
                    status: status < 0 ? null : status,
                    filter: filter ? filter : null,
                    pageIndex: pageIndex < 1 ? null : pageIndex,
                    pageSize: settings.pageSize
                }
            };

            $http.get('api/reports', config)
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.PaginatedList(data, modelSvc.ReportListItem);
                    log('Retrieved reports from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving reports from remote data source');
                });

            return deferred.promise;
        }

        function getTeamPendingReports(status, filter, pageIndex) {

            var deferred = $q.defer();

            var config = {
                params: {
                    status: status < 0 ? null : status,
                    filter: filter ? filter : null,
                    pageIndex: pageIndex < 1 ? null : pageIndex,
                    pageSize: settings.pageSize
                }
            };

            $http.get('/api/reports/team/pending', config)
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.PaginatedList(data, modelSvc.TeamReportListItem);
                    log('Retrieved team pending reports from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving team pending reports from remote data source');
                });

            return deferred.promise;
        }

        function getReportsSummary() {

            var deferred = $q.defer();

            $http.get('api/summary')
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.ReportsStatusesSummary(data, true);
                    log('Retrieved reports statuses summary from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving reports statuses from remote data source');
                });

            return deferred.promise;
        }

        function getTeamReportsSummary() {

            var deferred = $q.defer();

            $http.get('api/summary/team')
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.ReportsStatusesSummary(data, modelSvc.TeamReportListItem);
                    log('Retrieved team reports statuses summary from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving reports statuses from remote data source');
                });

            return deferred.promise;
        }

        function getReport(reportCode) {

            var deferred = $q.defer();

            $http.get('api/reports/' + reportCode)
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.Report(data);
                    log('Retrieved report from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving report from remote data source');
                });

            return deferred.promise;
        }

        function getReportDetail(reportCode) {

            var deferred = $q.defer();

            $http.get('api/reports/' + reportCode + '/details')
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.ReportDetail(data);
                    log('Retrieved report detail from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving report detail from remote data source');
                });

            return deferred.promise;
        }

        function getReportSummary(reportCode) {

            var deferred = $q.defer();

            $http.get('api/reports/' + reportCode + '/summary')
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.ReportListItemSummary(data);
                    log('Retrieved report summary from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving report summary from remote data source');
                });

            return deferred.promise;
        }

        function createReport(report) {

            var deferred = $q.defer();

            $http.post('api/reports/create', report)
                .success(function (data, status, headers, config) {
                    log('Created report in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error creating report in remote data source');
                });

            return deferred.promise;
        }

        function updateReport(reportCode, report) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/update', report)
                .success(function (data, status, headers, config) {
                    log('Updated report in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error updating report in remote data source');
                });

            return deferred.promise;
        }

        function deleteReport(reportCode) {

            var deferred = $q.defer();

            $http.delete('api/reports/' + reportCode + '/delete')
                .success(function (data, status, headers, config) {
                    log('Deleted report in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error deleting report in remote data source');
                });

            return deferred.promise;
        }

        function submitReportForApproval(reportCode) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/submit')
                .success(function (data, status, headers, config) {
                    log('Report submitted for approval in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error submitting a report for approval in remote data source');
                });

            return deferred.promise;
        }

        function cloneReport(reportCode) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/clone')
                .success(function (data, status, headers, config) {
                    log('Report cloned in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error cloning report in remote data source');
                });

            return deferred.promise;
        }

        function reimburseReportInPoints(reportCode) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/inpoints')
                .success(function (data, status, headers, config) {
                    log('Report setted to be charged in points in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error setting a report to be charged in points in remote data source');
                });

            return deferred.promise;
        }

        function reimburseReportInCash(reportCode) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/incash')
                .success(function (data, status, headers, config) {
                    log('Report setted to be charged in cash in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error setting a report to be charged in cash in remote data source');
                });

            return deferred.promise;
        }

        function approveReport(reportCode) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/approve')
                .success(function (data, status, headers, config) {
                    log('Report approved in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error approving a report in remote data source');
                });

            return deferred.promise;
        }

        function rejectReport(reportCode, rejectInfo) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/reject', rejectInfo)
                .success(function (data, status, headers, config) {
                    log('Report rejected in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error rejecting a report in remote data source');
                });

            return deferred.promise;
        }

        function reimburseReport(reportCode) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/reimburse')
                .success(function (data, status, headers, config) {
                    log('Report reimbursed in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error reimbursing a report in remote data source');
                });

            return deferred.promise;
        }

        function getExpenses(reportCode, filter) {

            var deferred = $q.defer();

            var config = {
                params: { 'filter': filter }
            };

            $http.get('api/reports/' + reportCode + '/expenses', config)
                .success(function (data, status, headers, config) {
                    var model = data.map(function (item) {
                        return new modelSvc.ExpenseListItem(item);
                    });
                    log('Retrieved expenses from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving expenses from remote data source');
                });

            return deferred.promise;
        }

        function getExpense(reportCode, expenseId) {

            var deferred = $q.defer();

            $http.get('api/reports/' + reportCode + '/expenses/' + expenseId)
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.Expense(data);
                    log('Retrieved expense from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving expense from remote data source');
                });

            return deferred.promise;
        }

        function getExpenseInfo(reportCode, expenseId) {

            var deferred = $q.defer();

            $http.get('api/reports/' + reportCode + '/expenses/' + expenseId + '/info')
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.ExpenseListItem(data);
                    log('Retrieved expense info from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving expense info from remote data source');
                });

            return deferred.promise;
        }

        function getExpenseDetails(reportCode, expenseId) {

            var deferred = $q.defer();

            $http.get('api/reports/' + reportCode + '/expenses/' + expenseId + '/details')
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.ExpenseListItemDetail(data);
                    log('Retrieved expense details from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving expense detail from remote data source');
                });

            return deferred.promise;
        }

        function createExpense(reportCode, expense) {

            var deferred = $q.defer();

            $http.post('api/reports/' + reportCode + '/expenses/create', expense)
                .success(function (data, status, headers, config) {
                    log('Expense created in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error creating an expense in remote data source');
                });

            return deferred.promise;
        }

        function updateExpense(reportCode, expenseId, expense) {

            var deferred = $q.defer();

            $http.put('api/reports/' + reportCode + '/expenses/' + expenseId + '/update', expense)
                .success(function (data, status, headers, config) {
                    log('Expense updated in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error updating an expense in remote data source');
                });

            return deferred.promise;
        }

        function deleteExpense(reportCode, expenseId) {

            var deferred = $q.defer();

            $http.delete('api/reports/' + reportCode + '/expenses/' + expenseId + '/delete')
                .success(function (data, status, headers, config) {
                    log('Expense deleted in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error deleting an expense in remote data source');
                });

            return deferred.promise;
        }

        function getCostCenters() {

            var deferred = $q.defer();

            $http.get('api/costcenters', { transformRequest: $http.defaults.transformRequest.concat([version2Header]) })
                .success(function (data, status, headers, config) {
                    var model = data.map(function (item) {
                        return new modelSvc.CostCenter(item);
                    });
                    log('Retrieved cost centers from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving cost centers from remote data source');
                });

            return deferred.promise;
        }

        function getExpenseCategories() {

            var deferred = $q.defer();

            $http.get('api/expensecategories', { transformRequest: $http.defaults.transformRequest.concat([version2Header]) })
                .success(function (data, status, headers, config) {
                    var model = data.map(function (item) {
                        return new modelSvc.ExpenseCategory(item);
                    });
                    log('Retrieved expense categories from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving expense categories from remote data source');
                });

            return deferred.promise;
        }

        function getCompanyPoints() {

            var deferred = $q.defer();

            $http.get('/api/buyers/current/companyPoints')
                .success(function (data, status, headers, config) {
                    log('Retrieved employee company points from remote data source');
                    deferred.resolve(data.CurrentCompanyPoints || 0);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving employee company points from remote data source');
                });

            return deferred.promise;
        }

        function getProducts(filter, pageIndex) {

            var deferred = $q.defer();

            var config = {
                params: {
                    filter: filter ? filter : null,
                    pageIndex: pageIndex < 1 ? null : pageIndex,
                    pageSize: 9
                }
            };

            $http.get('/api/products', config)
                .success(function (data, status, headers, config) {
                    var model = new modelSvc.PaginatedList(data, modelSvc.ProductListItem);
                    log('Retrieved products from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving products from remote data source');
                });

            return deferred.promise;
        }

        function getPurchasesHistory() {

            var deferred = $q.defer();

            $http.get('/api/purchases/history')
                .success(function (data, status, headers, config) {
                    var model = data.map(function (item) {
                        return new modelSvc.PurchaseHistoryItem(item);
                    });
                    log('Retrieved purchases history from remote data source');
                    deferred.resolve(model);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error retrieving purchases history from remote data source');
                });

            return deferred.promise;
        }

        function purchaseProduct(productId, units) {

            var deferred = $q.defer();

            var payload = { productId: productId, units: units };

            $http.post('api/purchases', payload)
                .success(function (data, status, headers, config) {
                    log('Purchase created in remote data source');
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error purchasing a product in remote data source');
                });

            return deferred.promise;
        }

        function getReportLink() {
            var deferred = $q.defer();
          
            $http.get('api/reports/chartlink')
                .success(function (data, status, headers, config) {
                    log('Retrieve chart link in remote data source');
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error getting chart link in remote data source');
                });

            return deferred.promise;
        }

        function getReportPowerBI() {
            var deferred = $q.defer();

            $http.get('api/powerbireport')
                .success(function (data, status, headers, config) {
                    log('Retrieve powerbi link in remote data source');
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    handleError(deferred, data, 'Error getting powerbi link in remote data source');
                });

            return deferred.promise;
        }

        var service = {
            getLoggedEmployeeInfo: getLoggedEmployeeInfo,
            getReports: getReports,
            getTeamPendingReports: getTeamPendingReports,
            getReportsSummary: getReportsSummary,
            getReport: getReport, //old
            getReportDetail: getReportDetail,
            getReportSummary: getReportSummary,
            getTeamReportsSummary: getTeamReportsSummary,
            createReport: createReport,
            updateReport: updateReport,
            deleteReport: deleteReport,
            submitReportForApproval: submitReportForApproval,
            cloneReport: cloneReport,
            reimburseReportInPoints: reimburseReportInPoints,
            reimburseReportInCash: reimburseReportInCash,
            approveReport: approveReport,
            rejectReport: rejectReport,
            reimburseReport: reimburseReport,
            getExpenses: getExpenses,
            getExpense: getExpense,
            getExpenseInfo: getExpenseInfo,
            getExpenseDetails: getExpenseDetails,
            createExpense: createExpense,
            updateExpense: updateExpense,
            deleteExpense: deleteExpense,
            getCostCenters: getCostCenters,
            getExpenseCategories: getExpenseCategories,
            getCompanyPoints: getCompanyPoints,
            getProducts: getProducts,
            getPurchasesHistory: getPurchasesHistory,
            purchaseProduct: purchaseProduct,
            getReportLink: getReportLink,
            getReportPowerBI: getReportPowerBI
        };

        return service;
    }

} ());