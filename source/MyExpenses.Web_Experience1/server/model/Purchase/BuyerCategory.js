'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('BuyerCategory', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        maxPointsInFiscalYear: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: '((0))'
        }
    }, {
        tableName: 'BuyerCategory',
        timestamps: false,
        schema: 'Purchase'
    });
};
