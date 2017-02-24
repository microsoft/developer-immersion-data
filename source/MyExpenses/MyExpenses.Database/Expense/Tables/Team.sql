CREATE TABLE [Expense].[Team] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [TeamName] NVARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Expenses.Teams] PRIMARY KEY CLUSTERED ([Id] ASC)
);

