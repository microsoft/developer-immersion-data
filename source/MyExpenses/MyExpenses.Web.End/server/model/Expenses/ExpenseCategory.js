'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ExpenseCategory', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        defaultAmount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        tableName: 'ExpenseCategory',
        timestamps: false,
        schema: 'Expense',
    });
};
