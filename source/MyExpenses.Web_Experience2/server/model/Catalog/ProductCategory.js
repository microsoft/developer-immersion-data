'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ProductCategory', {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'ProductCategory',
        schema: 'Catalog',
        timestamps: false
    });
};
