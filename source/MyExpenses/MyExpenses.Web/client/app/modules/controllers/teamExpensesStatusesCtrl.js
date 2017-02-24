(function () {
    'use strict';

    angular.module('expensesApp').controller('TeamExpensesStatusesCtrl', [
        '$scope',
        'dataSvc',
        'constants',
        teamExpensesStatusesCtrl
    ]);

    function teamExpensesStatusesCtrl($scope, dataSvc, constants) {

        var cleanupContainer = [];

        function setStatusActive(statusId) {
            for (var i = 0; i < $scope.statuses.length; i++) {
                var currentStatus = $scope.statuses[i];
                if (currentStatus.status !== statusId) {
                    currentStatus.active = false;
                } else {
                    currentStatus.active = true;
                }
            }
        }

        function loadStatusesMaintainingCurrentStatus() {
            var activeStatusId = -1;
            for (var i = 0; i < $scope.statuses.length; i++) {
                var currentStatus = $scope.statuses[i];
                if (currentStatus.active === true) {
                    activeStatusId = currentStatus.status;
                    break;
                }
            }
            $scope.loadStatuses(activeStatusId);
        }

        $scope.statuses = [];

        $scope.loadStatuses = function (currentStatus) {
            $scope.showLoading();
            dataSvc.getTeamReportsSummary().then(
                function (result) {
                    $scope.statuses = result;
                    if (currentStatus >= 0) {
                        setStatusActive(currentStatus);
                    }
                    $scope.hideLoading();
                },
                function (error) {
                    // Manage error!
                    console.log(error);
                    $scope.hideLoading();
                }
            );
        };

        $scope.navigateToStatus = function (statusId) {
            setStatusActive(statusId);
            $scope.$emit(constants.reportStatusNavigatedMessage, statusId);
        };

        cleanupContainer.push($scope.$on(constants.teamReportsStatusesChangedMessage, function (event) {
            loadStatusesMaintainingCurrentStatus();
        }));

        cleanupContainer.push($scope.$on('$destroy', function () {

            angular.forEach(cleanupContainer, function (element) {
                element();
            });

        }));

        $scope.loadStatuses();

    }
}());
