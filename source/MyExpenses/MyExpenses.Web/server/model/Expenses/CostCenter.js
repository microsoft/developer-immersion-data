'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CostCenter', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'CostCenter',
        schema: 'Expense'
    });
};
