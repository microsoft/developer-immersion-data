CREATE TABLE [Expense].[ExpenseBonus] (
    [Id]        INT            IDENTITY (1, 1) NOT NULL,
    [Amount]    FLOAT (53)     NOT NULL,
    [Reason]    NVARCHAR (250) NOT NULL,
    [ExpenseId] INT            NOT NULL,
    CONSTRAINT [PK_Expenses.ExpenseBonus] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expenses.ExpenseBonus_Expenses.Expenses_ExpenseId] FOREIGN KEY ([ExpenseId]) REFERENCES [Expense].[Expense] ([Id]) ON DELETE CASCADE
);




GO
CREATE NONCLUSTERED INDEX [IX_ExpenseId]
    ON [Expense].[ExpenseBonus]([ExpenseId] ASC);

