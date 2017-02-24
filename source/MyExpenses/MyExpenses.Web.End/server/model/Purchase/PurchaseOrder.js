'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PurchaseOrder', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'Id'
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'EmployeePurchase',
                key: 'EmployeeId'
            }
        }
    }, {
        tableName: 'PurchaseOrder',
        timestamps: false,
        schema: 'Purchase'
    });
};
