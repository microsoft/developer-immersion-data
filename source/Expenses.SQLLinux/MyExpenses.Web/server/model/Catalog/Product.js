'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        available: {
            type: 'BIT',
            allowNull: false
        },
        productCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ProductCategory',
                key: 'Id'
            }
        },
        largePicture: {
            type: 'VARBINARY',
            allowNull: true
        },
        thumbnailPicture: {
            type: 'VARBINARY',
            allowNull: true
        },
        //additionalInformation: {
        //    type: DataTypes.STRING,
        //    allowNull: true
        //}        
    }, {
        tableName: 'Product',
        schema: 'Catalog',
        timestamps: false

    });
};
