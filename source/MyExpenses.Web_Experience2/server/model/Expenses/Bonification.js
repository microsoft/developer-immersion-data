'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Bonification', {
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
        enabled: {
            type: 'BIT',
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        from: {
            type: DataTypes.DATE,
            allowNull: false
        },
        to: {
            type: DataTypes.DATE,
            allowNull: false
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Employee',
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
        }
    }, {
        timestamps: false,
        tableName: 'Bonification',
        schema: 'Expense'
    });
};
