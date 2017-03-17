'use strict';

let Expenses = require('../../../../model/Expenses');

let sequelize = Expenses.sequelize;

let evaluateExpense = function (expense) {
    return sequelize.query(`
        DECLARE @RC int
        DECLARE @ExpenseId nvarchar(50) = ':expenseId' ;
      
        EXECUTE @RC = [Expense].[EvaluateExpense]
                @ExpenseId`, { replacements: { expenseId: expense.id } })        
        .catch(function (err) {
            console.error(err);
        });
};

module.exports = evaluateExpense;