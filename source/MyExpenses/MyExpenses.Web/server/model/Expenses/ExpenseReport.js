'use strict';

const status = require('./ReportStatus');

const messages = require('../../locales/messages');

let ApplicationError = require('../../error/ApplicationError');

let total = function () {
    let total = 0;

    if (this.Expenses) {
        this.Expenses.forEach(function(expense) {
            total += expense.total();
        });
    }

    return total;
};

let points = function () {
    let points = 0;
    
    this.Expenses.forEach(function(expense) {
        points += expense.points();
    });

    return points;
};

let submitForApproval = function () {
    if (this.status === status.UnSubmittedForApproval) {
        this.submissionDate = Date.now();
        this.status = status.SubmittedForApproval;
    } else {        
        throw new ApplicationError(messages.CantSubmitNonUnsubmittedReport);
    }
};

let inPoints = function () {
    if (this.status === status.Reimbursed || this.status === status.Rejected) {
        throw new ApplicationError(messages.CantChangeReimburseMode);
    }
    this.reimburseInPoints = true;
};

let inCash = function () {
    if (this.status === status.Reimbursed || this.status === status.Rejected) {
        throw new ApplicationError(messages.CantChangeReimburseMode);
    }
    this.reimburseInPoints = false;
};

let clone = function () {
    if (this.status === status.Reimbursed || this.status === status.Rejected) {
        throw new ApplicationError(messages.RejectedOrReimbursedCantBeCloned);
    }

    let r = this.get({ plain: true });
   
    let newReport = {};

    newReport.createdOn = Date.now();
    newReport.status = status.UnSubmittedForApproval;
    newReport.reimburseInPoints = r.reimburseInPoints;

    newReport.costCenterId = r.costCenterId;
    newReport.employeeId = r.employeeId;
    newReport.purpose = r.purpose;
    newReport.description = r.description;
   
    newReport.Expenses = [];
    r.Expenses.forEach(function (exp) {
        delete exp['id'];
        exp.expenseReportId = null;
        exp.date = Date.now();
        newReport.Expenses.push(exp);
                             
        exp.ExpenseBonus.forEach(function (expBonus) {
            delete exp['id'];
            expBonus.expenseId = null;
        });
       
    });

    return newReport;
};

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ExpenseReport', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'Id'
        },
        costCenterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CostCenter',
                key: 'Id'
            }
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.NOW
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Employee',
                key: 'Id'
            }
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sequenceNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SequenceNumber'          
        },
        summary: {
            type: DataTypes.STRING,
            allowNull: true
        },
        submissionDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        reimburseInPoints: {
            type: 'BIT',
            allowNull: false,
            defaultValue: '((0))'
        }
    }, {
        timestamps: false,
        tableName: 'ExpenseReport',
        schema: 'Expense',
        instanceMethods: {
            total: total,
            points: points,
            submitForApproval: submitForApproval,
            inPoints: inPoints,
            inCash: inCash,
            clone: clone
        }
    });
};
