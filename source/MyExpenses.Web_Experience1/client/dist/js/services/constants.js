(function () {
    'use strict';

    angular.module('expensesApp').constant('constants', {
        userInfoUpdatedMessage: 'userInfoUpdated',
        reportStatusNavigatedMessage: 'reportStatusNavigated',
        reportsStatusesChangedMessage: 'reportsStatusesChanged',
        teamReportsStatusesChangedMessage: 'teamReportsStatusesChanged',
        // Manager to Employee
        reportApprovedMessage: 'reportApproved',
        reportRejectedMessage: 'reportRejected',
        reportReimbursedMessage: 'reportReimbursed',
        // Employee to Manager
        reportSubmittedMessage: 'reportSubmitted',
        reportDeletedMessage: 'reportDeleted',
        reportReimbursedInCash: 'reimburseInCash',
        reportReimbursedInPoints: 'reimburseInPoints',
        reportAddedExpense: 'addedExpense',
        reportModifiedExpense: 'modifiedExpense',
        reportDeletedExpense: 'deletedExpense'
    });

}());