CREATE TABLE [Expense].[Bonification] (
    [Id]                INT            IDENTITY (1, 1) NOT NULL,
    [Amount]            FLOAT (53)     NOT NULL,
    [Enabled]           BIT            NOT NULL,
    [Description]       NVARCHAR (200) NOT NULL,
    [From]              DATETIME2 (7)  NOT NULL,
    [To]                DATETIME2 (7)  NOT NULL,
    [EmployeeId]        INT            NOT NULL,
    [ExpenseCategoryId] SMALLINT       NOT NULL,
    CONSTRAINT [PK_Expenses.Bonifications] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expense.Bonifications_Expense.Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Expense].[Employee] ([Id]),
    CONSTRAINT [FK_Expenses.Bonifications_Expenses.Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Expense].[Employee] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Expenses.Bonifications_Expenses.ExpenseCategories_ExpenseCategoryId] FOREIGN KEY ([ExpenseCategoryId]) REFERENCES [Expense].[ExpenseCategory] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_ExpenseCategoryId]
    ON [Expense].[Bonification]([ExpenseCategoryId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_EmployeeId]
    ON [Expense].[Bonification]([EmployeeId] ASC);

