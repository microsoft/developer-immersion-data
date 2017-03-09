(function () {
    'use strict';

    angular.module('expensesApp').factory('dialogSvc', dialogSvc);

    function dialogSvc($q, $uibModal) {

        var defaultOptions = {
            templateUrl: 'DefaultModalMessage.html',
            controller: 'DefaultModalMessageCtrl',
            backdrop: true,
            keyboard: true,
            windowClass: 'modal-msgBox',
            size: 'sm'
        };

        function getSize(size) {
            switch (size) {
                case 's':
                    return 'sm';
                case 'm':
                    return '';
                case 'l':
                    return 'lg';
                default:
                    return 'sm';
            }
        }

        function showMessage(message, options, title) {
            var dialogOptions = angular.copy(defaultOptions);

            dialogOptions.resolve = {
                model: function () {
                    return {
                        message: message,
                        options: options || ['Ok'], 
                        title: title
                    };
                }
            };

            return $uibModal.open(dialogOptions);
        };

        function showCustomDialog(config, model) {
            var dialogOptions = angular.copy(defaultOptions),
                view = config.view || 'DefaultModalMessage.html',
                controller = config.controller || 'DefaultModalMessageCtrl',
                size = getSize(config.size);

            dialogOptions.templateUrl = view;
            dialogOptions.controller = controller;
            dialogOptions.size = size;

            dialogOptions.resolve = {
                model: function () {
                    return model;
                }
            };

            return $uibModal.open(dialogOptions);
        };

        function confirmation(confirmationButtonText, confirmationMessage, title) {

            var deferred = $q.defer();

            var modalInstance = showMessage(confirmationMessage,
                [
                    { value: 0, text: 'Cancel' },
                    { value: 1, text: confirmationButtonText }
                ], title);

            modalInstance.result.then(
                function (result) {
                    if (result.value === 1) {
                        // Modal closed with confirm button
                        deferred.resolve();
                    } else {
                        // Modal closed with cancel button
                        deferred.reject();
                    }
                },
                function (reason) {
                    // Modal dismissed
                    deferred.reject();
                }
            );

            return deferred.promise;
        }

        function dialog(config, model) {

            var deferred = $q.defer();

            var modalInstance = showCustomDialog(config, model);

            modalInstance.result.then(
                function (result) {
                    // Dialog confirmed
                    deferred.resolve(result);
                },
                function (reason) {
                    // Dialog dismissed
                    deferred.reject();
                }
            );

            return deferred.promise;

        }

        var service = {
            showMessage: showMessage,
            showCustomDialog: showCustomDialog,
            confirmation: confirmation,
            dialog: dialog
        };

        return service;
    }
}());