'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Picture', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        pictureType: {
            type: DataTypes.INTEGER,
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
        content: {
            type: 'VARBINARY',
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'Picture',
        schema: 'Expense'
    });
};
