CREATE SECURITY POLICY [dbo].[ExpensesReportPolicy]
    ADD FILTER PREDICATE [Expense].[fn_expensesReportsPredicate]([EmployeeId]) ON [Expense].[ExpenseReport]
    WITH (STATE = ON);

