'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ExpenseBonus', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expenseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Expense',
                key: 'Id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'ExpenseBonus',
        schema: 'Expense'
    });
};
