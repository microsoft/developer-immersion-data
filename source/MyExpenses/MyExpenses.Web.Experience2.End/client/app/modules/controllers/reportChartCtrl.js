(function () {
    'use strict';

    angular.module('expensesApp').controller('ReportChartCtrl', [
        '$scope',
        'dataSvc',
        '$sce',      
        reportChartCtrl]);

    function reportChartCtrl($scope, dataSvc, $sce, $timeout) {

       
        function postActionLoadTile() {
            
            var m = {
                action: "loadReport",
                accessToken: $scope.token,
                height: 900,
                width: 722
              
            };
            var message = JSON.stringify(m); // push the message. S
            var iframe = document.getElementById('ifrTile');
          
            iframe.onload = function () {
                iframe.contentWindow.postMessage(message, "*");
            };
          
        }

             
        $scope.getReportPowerBI = function () {

            return dataSvc.getReportPowerBI().then(function (result) {

                $scope.embedUrl = $sce.trustAsResourceUrl(result.embedUrl);
                $scope.token = result.token;

                postActionLoadTile();


            });
        };
                   
        $scope.getReportPowerBI();

        console.log('report chart page');
    }
}());
