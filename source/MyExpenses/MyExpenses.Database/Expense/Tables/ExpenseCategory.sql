CREATE TABLE [Expense].[ExpenseCategory] (
    [Id]            SMALLINT       IDENTITY (1, 1) NOT NULL,
    [Title]         NVARCHAR (50)  NOT NULL,
    [Description]   NVARCHAR (250) NOT NULL,
    [DefaultAmount] FLOAT (53)     NOT NULL,
    CONSTRAINT [PK_Expenses.ExpenseCategories] PRIMARY KEY CLUSTERED ([Id] ASC)
);

