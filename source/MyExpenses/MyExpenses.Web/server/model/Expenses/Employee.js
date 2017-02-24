'use strict';

let fullName = function () {
    return this.firstName + ' ' + this.lastName;
};

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        identifier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        jobTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        teamId: {
            type: DataTypes.INTEGER,
            allowNull: false,            
            references: {
                model: 'Team',
                key: 'Id'
            }            
        },
        isTeamManager: {
            type: 'BIT',
            allowNull: false
        },
        bankAccountNumber: {
            type: DataTypes.STRING,
            allowNull: false,

        }
    }, {
        timestamps: false,
        tableName: 'Employee',
        schema: 'Expense',
        instanceMethods: {
            fullName: fullName
        }
    });
};