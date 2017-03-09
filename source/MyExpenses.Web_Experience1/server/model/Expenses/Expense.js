'use strict';

function moneyToPointsService() {
    return 1.20;
}

function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

let total = function() { 
    let bonus = 0;

    this.ExpenseBonus.forEach(function(expBonus) {
        bonus += expBonus.amount;
    });

    let total = this.amount + bonus;

    if (this.isRecurrent()) {
        total *= this.daysEnabled(); 
    }

    return total;
};

let points = function() {
    return this.total() * moneyToPointsService();
};

let isRecurrent = function() {
    return this.isValidPattern();
};

let isValidPattern = function() {
    if ((this.enabledFrom && this.enabledFrom != null) &&
        (this.enabledTo && this.enabledTo != null)) {
        if (this.daysEnabled() > 1) {
            return true;
        }
    }
    return false;
};

let daysEnabled = function() {
    if ((this.enabledFrom && this.enabledFrom != null) &&
        (this.enabledTo && this.enabledTo != null)) {
        let dates = daydiff(this.enabledFrom, this.enabledTo);
        return dates;
    }
    return 0;
};

let totalBonus = function () {
    let tBonus = 0;

    this.ExpenseBonus.forEach(function(b) {
        tBonus += b.amount;
    });

    return tBonus;
};

let isSuspicious = function () {
    let isSus = false;
    if (this.SuspiciousExpenses && Array.isArray(this.SuspiciousExpenses) && this.SuspiciousExpenses.length > 0) {
        isSus = true;
    }
    return isSus;
};

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Expense', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'Id'
        },
        enabledFrom: {
            type: DataTypes.DATE,
            allowNull: true
        },
        enabledTo: {
            type: DataTypes.DATE,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        expenseReportId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ExpenseReport',
                key: 'Id'
            }
        },
        expenseCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ExpenseCategory',
                key: 'Id'
            }
        },
        receiptPicture: {
            type: 'VARBINARY',
            allowNull: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: '1900-01-01T00:00:00.000'
        }
    }, {
        timestamps: false,
        tableName: 'Expense',
        schema: 'Expense',
        instanceMethods: {
            total: total,
            isRecurrent: isRecurrent,
            isValidPattern: isValidPattern,
            daysEnabled: daysEnabled,
            points: points,
            totalBonus: totalBonus,
            isSuspicious: isSuspicious
        }
    });
};