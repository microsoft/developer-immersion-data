(function () {
    'use strict';

    angular.module('expensesApp').factory('loggerSvc', [
        loggerSvc
    ]);

    function loggerSvc() {

        function log(message, data, source) {
            source = source ? '[' + source + '] ' : '';
            if (data) {
                console.log(source + message + '\n' + data);
            } else {
                console.log(source + message);
            }
        }

        var service = {
            log: log
        };

        return service;

    }
}());
