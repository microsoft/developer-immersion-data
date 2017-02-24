CREATE TABLE [Expense].[Expense] (
    [Id]                INT             IDENTITY (1, 1) NOT NULL,
    [EnabledFrom]       DATETIME2 (7)   NULL,
    [EnabledTo]         DATETIME2 (7)   NULL,
    [Title]             NVARCHAR (50)   NOT NULL,
    [Notes]             NVARCHAR (250)  NULL,
    [Amount]            FLOAT (53)      NOT NULL,
    [ExpenseReportId]   INT             NOT NULL,
    [ExpenseCategoryId] SMALLINT        NOT NULL,
    [ReceiptPicture]    VARBINARY (MAX) NULL,
    [Date]              DATETIME2 (7)   DEFAULT ('1900-01-01T00:00:00.000') NOT NULL,
    CONSTRAINT [PK_Expenses.Expenses] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expenses.Expenses_Expenses.ExpenseCategories_ExpenseCategoryId] FOREIGN KEY ([ExpenseCategoryId]) REFERENCES [Expense].[ExpenseCategory] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Expenses.Expenses_Expenses.ExpenseReports_ExpenseReportId] FOREIGN KEY ([ExpenseReportId]) REFERENCES [Expense].[ExpenseReport] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_ExpenseReportId]
    ON [Expense].[Expense]([ExpenseReportId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_ExpenseCategoryId]
    ON [Expense].[Expense]([ExpenseCategoryId] ASC);

