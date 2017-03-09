'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('AccountMovement', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        movement: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        movementDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
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
        tableName: 'AccountMovement',
        timestamps: false,
        schema: 'Purchase'
    });
};
