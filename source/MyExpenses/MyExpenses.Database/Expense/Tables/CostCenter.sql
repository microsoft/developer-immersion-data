CREATE TABLE [Expense].[CostCenter] (
    [Id]          SMALLINT       IDENTITY (1, 1) NOT NULL,
    [Code]        NVARCHAR (50)  NOT NULL,
    [Description] NVARCHAR (200) NULL,
    CONSTRAINT [PK_Expenses.CostCenters] PRIMARY KEY CLUSTERED ([Id] ASC)
);

