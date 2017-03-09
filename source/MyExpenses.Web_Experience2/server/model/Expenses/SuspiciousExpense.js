'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('SuspiciousExpense', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        suspiciousExpenseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Expense',
                key: 'Id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'SuspiciousExpense',
        schema: 'Expense'
    });
};
