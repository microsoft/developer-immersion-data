(function () {
    'use strict';

    angular.module('expensesApp').factory('notificationsSvc', [
        '$rootScope',
        'constants',
        'loggerSvc',
        notificationsSvc
    ]);

    function notificationsSvc($rootScope, constants, loggerSvc) {

        function log(msg, data) {
            loggerSvc.log(msg, data, 'notificationsSvc');
        }

        // var notificationHub = $.connection.notificationsHub;

        // // Enable logging
        // $.connection.hub.logging = true;

        // // Configure error callback
        // $.connection.hub.error(function (error) {
        //     log('SignalR error: ' + error);
        // });

        function startConnection(token) {
            // if (notificationHub) {

            //     $.connection.hub.qs = { "access_token": token };

            //     // Manager to Employee

            //     notificationHub.client.approvedReport = function (expenseReportSequenceNumber) {
            //         $rootScope.$broadcast(constants.reportApprovedMessage, expenseReportSequenceNumber);
            //     };

            //     notificationHub.client.rejectedReport = function (expenseReportSequenceNumber) {
            //         $rootScope.$broadcast(constants.reportRejectedMessage, expenseReportSequenceNumber);
            //     };

            //     notificationHub.client.reimbursedReport = function (expenseReportSequenceNumber) {
            //         $rootScope.$broadcast(constants.reportReimbursedMessage, expenseReportSequenceNumber);
            //     };

            //     // Employee to Manager

            //     notificationHub.client.submittedReport = function (expenseReportSequenceNumber) {
            //         $rootScope.$broadcast(constants.reportSubmittedMessage, expenseReportSequenceNumber);
            //     };

            //     notificationHub.client.deletedReport = function (expenseReportSequenceNumber) {
            //         $rootScope.$broadcast(constants.reportDeletedMessage, expenseReportSequenceNumber);
            //     };

            //     notificationHub.client.reimburseInCash = function (expenseReportSequenceNumber) {
            //         $rootScope.$broadcast(constants.reportReimbursedInCash, expenseReportSequenceNumber);
            //     };

            //     notificationHub.client.reimburseInPoints = function (expenseReportSequenceNumber) {
            //         $rootScope.$broadcast(constants.reportReimbursedInPoints, expenseReportSequenceNumber);
            //     };

            //     notificationHub.client.addedExpense = function (expenseReportSequenceNumber, expenseId) {
            //         $rootScope.$broadcast(constants.reportAddedExpense, expenseReportSequenceNumber, expenseId);
            //     };

            //     notificationHub.client.modifiedExpense = function (expenseReportSequenceNumber, expenseId) {
            //         $rootScope.$broadcast(constants.reportModifiedExpense, expenseReportSequenceNumber, expenseId);
            //     };

            //     notificationHub.client.deletedExpense = function (expenseReportSequenceNumber, expenseId) {
            //         $rootScope.$broadcast(constants.reportDeletedExpense, expenseReportSequenceNumber, expenseId);
            //     };

            //     $.connection.hub.start()
            //         .done(function () {
            //             if ($.connection.hub.state === $.signalR.connectionState.connected) {
            //                 log("connected");
            //             }
            //         })
            //         .fail(function (error) {
            //             log(error);
            //         });

            // } else {
            //     log('notification hub unavailable');
            // }
        };

        return {
            start: startConnection
        };
    }
}());