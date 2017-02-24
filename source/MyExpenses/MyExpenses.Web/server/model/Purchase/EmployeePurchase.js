'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('EmployeePurchase', {
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Employee',
                key: 'Id'
            },
            primaryKey: true
        },
        buyerCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: '((0))',
            references: {
                model: 'BuyerCategory',
                key: 'Id'
            }
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'EmployeePurchase',
        timestamps: false,
        schema: 'Purchase'
    });
};
