(function () {
    'use strict';

    angular.module('expensesApp').factory('toastrSvc', [
        '$q',
        '$rootScope',
        toastrSvc
    ]);

    function toastrSvc($q, $rootScope) {

        function info(message, title) {

            var deferred = $q.defer();
            var resolved = false;

            toastr.info(message, title, {
                onclick: function () {
                    resolved = true;
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                },
                onHidden: function () {
                    if (!resolved) {
                        $rootScope.$apply(function () {
                            deferred.reject();
                        });
                    }
                }
            });

            return deferred.promise;

        }

        function success(message, title) {

            var deferred = $q.defer();
            var resolved = false;

            toastr.alert(message, title, {
                onclick: function () {
                    resolved = true;
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                },
                onHidden: function () {
                    if (!resolved) {
                        $rootScope.$apply(function () {
                            deferred.reject();
                        });
                    }
                }
            });

            return deferred.promise;

        }

        function alert(message, title) {

            var deferred = $q.defer();
            var resolved = false;

            toastr.alert(message, title, {
                onclick: function () {
                    resolved = true;
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                },
                onHidden: function () {
                    if (!resolved) {
                        $rootScope.$apply(function () {
                            deferred.reject();
                        });
                    }
                }
            });

            return deferred.promise;

        }

        function error(message, title) {

            var deferred = $q.defer();
            var resolved = false;

            toastr.error(message, title, {
                onclick: function () {
                    resolved = true;
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                },
                onHidden: function () {
                    if (!resolved) {
                        $rootScope.$apply(function () {
                            deferred.reject();
                        });
                    }
                }
            });

            return deferred.promise;

        }

        var service = {
            info: info,
            success: success,
            alert: alert,
            error: error
        };

        return service;

    }
}());