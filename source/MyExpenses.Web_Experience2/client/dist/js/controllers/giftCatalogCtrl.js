(function () {
    'use strict';

    angular.module('expensesApp').controller('GiftCatalogCtrl', [
        '$scope',
        '$location',
        'constants',
        'dataSvc',
        'dialogSvc',
        'toastrSvc',
        'authSvc',
        giftCatalogCtrl
    ]);

    function giftCatalogCtrl($scope, $location, constants, dataSvc, dialogSvc, toastrSvc, authSvc) {

        function generateImageUrl(productId) {
            return '/api/products/' + productId + '/picture?access_token=' + authSvc.getAuthToken();
        }

        var cleanupContainer = [];

        $scope.companyPoints = 0;

        $scope.query = '';

        $scope.products = [];

        $scope.pages = [];

        $scope.paginationInfo = { totalCount: 0 };

        $scope.getCompanyPoints = function () {
            $scope.showLoading();
            dataSvc.getCompanyPoints().then(
                function (result) {
                    $scope.companyPoints = result;
                    $scope.hideLoading();
                },
                function (error) {
                    // Manage error!
                    $scope.hideLoading();
                }
            );
        };

        $scope.navigateToPage = function (pageIndex) {
            $scope.showLoading();
            dataSvc.getProducts($scope.query, pageIndex).then(
                function (result) {
                    var products = result.items;
                    $scope.products = products.map(function (p) {
                        p.pictureUrl = p.externalPicture || generateImageUrl(p.id);
                        return p;
                    });
                    $scope.pages = result.pages;
                    $scope.paginationInfo = result.paginationInfo;
                    $scope.hideLoading();
                },
                function (error) {
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

        $scope.purchaseProduct = function (product) {

            console.log(product.additionalInformation);   
            var model = {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                units: 1,
                currentPoints: $scope.companyPoints,
                genre: product.genre,
                esrb: product.esrb,
                developer: product.developer,
                pictureUrl: product.externalPicture
            };

            var config = {
                view: 'PurchaseProduct.html',
                controller: 'PurchaseProductCtrl',
                size: 'm'
            };

            dialogSvc.dialog(config, model)
                .then(function onDialogConfirmed(data) {

                    dataSvc.purchaseProduct(product.id, data.units)
                        .then(function onSuccess(result) {
                            $scope.getCompanyPoints();
                            toastrSvc.info('Your purchase has been succesfully submitted', 'Purchase completed');
                        },
                        function onError(result) {
                            toastrSvc.error(result);
                        });

                });

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

            $scope.getCompanyPoints();
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
        $scope.getCompanyPoints();
        $scope.navigateToPage(0);
    }

}());
