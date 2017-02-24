CREATE TABLE [Expense].[Expense] (
    [Id]                INT                                         IDENTITY (1, 1) NOT NULL,
    [EnabledFrom]       DATETIME2 (7)                               NULL,
    [EnabledTo]         DATETIME2 (7)                               NULL,
    [Title]             NVARCHAR (50)                               NOT NULL,
    [Notes]             NVARCHAR (250)                              NULL,
    [Amount]            FLOAT (53)                                  NOT NULL,
    [ExpenseReportId]   INT                                         NOT NULL,
    [ExpenseCategoryId] SMALLINT                                    NOT NULL,
    [ReceiptPicture]    VARBINARY (MAX)                             NULL,
    [Date]              DATETIME2 (7)                               DEFAULT ('1900-01-01T00:00:00.000') NOT NULL,
    [SysStartTime]      DATETIME2 (7) GENERATED ALWAYS AS ROW START NOT NULL,
    [SysEndTime]        DATETIME2 (7) GENERATED ALWAYS AS ROW END   NOT NULL,
    CONSTRAINT [PK_ExpenseTemporal.Expense] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expense.ExpenseTemporal_Expense.ExpenseCategories_ExpenseCategoryId] FOREIGN KEY ([ExpenseCategoryId]) REFERENCES [Expense].[ExpenseCategory] ([Id]),
    CONSTRAINT [FK_Expense.ExpenseTemporal_Expense.ExpenseReport_ExpenseReportId] FOREIGN KEY ([ExpenseReportId]) REFERENCES [Expense].[ExpenseReport] ([Id]),
    PERIOD FOR SYSTEM_TIME ([SysStartTime], [SysEndTime])
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE=[Expense].[ExpenseHistory], DATA_CONSISTENCY_CHECK=ON));

