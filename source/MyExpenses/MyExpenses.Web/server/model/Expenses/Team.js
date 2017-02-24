'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Team', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        teamName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'Team',
        schema: 'Expense'
    });
};
