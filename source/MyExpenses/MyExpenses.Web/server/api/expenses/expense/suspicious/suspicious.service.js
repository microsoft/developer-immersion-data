'use strict';

let evaluateExpense = function (suspiciousStrategy, expense) {
    if (typeof suspiciousStrategy === 'function')
        return suspiciousStrategy(expense);
};

module.exports = {
    evaluateExpense: evaluateExpense,
};
