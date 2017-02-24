CREATE TABLE [Expense].[ExpenseHistory] (
    [Id]                INT             NOT NULL,
    [EnabledFrom]       DATETIME2 (7)   NULL,
    [EnabledTo]         DATETIME2 (7)   NULL,
    [Title]             NVARCHAR (50)   NOT NULL,
    [Notes]             NVARCHAR (250)  NULL,
    [Amount]            FLOAT (53)      NOT NULL,
    [ExpenseReportId]   INT             NOT NULL,
    [ExpenseCategoryId] SMALLINT        NOT NULL,
    [ReceiptPicture]    VARBINARY (MAX) NULL,
    [Date]              DATETIME2 (7)   NOT NULL,
    [SysStartTime]      DATETIME2 (7)   NOT NULL,
    [SysEndTime]        DATETIME2 (7)   NOT NULL
);


GO
CREATE CLUSTERED INDEX [ix_ExpenseHistory]
    ON [Expense].[ExpenseHistory]([SysEndTime] ASC, [SysStartTime] ASC) WITH (DATA_COMPRESSION = PAGE);

