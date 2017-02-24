CREATE TABLE [Expense].[ExpenseReport] (
    [Id]                INT            IDENTITY (1, 1) NOT NULL,
    [CostCenterId]      SMALLINT       NOT NULL,
    [Purpose]           NVARCHAR (250) NOT NULL,
    [CreatedOn]         DATETIME2 (7)  NOT NULL,
    [EmployeeId]        INT            NOT NULL,
    [Status]            SMALLINT       NOT NULL,
    [Description]       NVARCHAR (255) NULL,
    [SequenceNumber]    AS             ((('ER'+CONVERT([nvarchar](max),[EmployeeId]))+'-')+CONVERT([nvarchar](max),[Id])),
    [Summary]           NVARCHAR (250) NULL,
    [SubmissionDate]    DATETIME2 (7)  NULL,
    [ReimburseInPoints] BIT            DEFAULT ((0)) NOT NULL,
    [VersionTimeStamp]  ROWVERSION     NOT NULL,
    CONSTRAINT [PK_Expenses.ExpenseReports] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expenses.ExpenseReports_Expenses.CostCenters_CostCenterId] FOREIGN KEY ([CostCenterId]) REFERENCES [Expense].[CostCenter] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Expenses.ExpenseReports_Expenses.Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Expense].[Employee] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_EmployeeId]
    ON [Expense].[ExpenseReport]([EmployeeId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_CostCenterId]
    ON [Expense].[ExpenseReport]([CostCenterId] ASC);

