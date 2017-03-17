'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PurchaseOrderItem', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        purchaseHistoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PurchaseOrder',
                key: 'Id'
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'Id'
            }
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        itemsNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'PurchaseOrderItem',
        timestamps: false,
        schema: 'Purchase'
    });
};
