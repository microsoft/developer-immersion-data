CREATE TABLE [Expense].[SuspiciousExpense] (
    [Id]                  INT IDENTITY (1, 1) NOT NULL,
    [SuspiciousExpenseId] INT NOT NULL,
    CONSTRAINT [PK_SuspiciousExpense] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_SuspiciousExpense_Expense] FOREIGN KEY ([SuspiciousExpenseId]) REFERENCES [Expense].[Expense] ([Id])
);



