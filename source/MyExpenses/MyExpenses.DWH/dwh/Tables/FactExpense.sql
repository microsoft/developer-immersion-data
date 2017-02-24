CREATE TABLE [dwh].[FactExpense] (
    [IdExpense]         INT        NOT NULL,
    [IdCalendar]        INT        NOT NULL,
    [IdExpenseCategory] SMALLINT   NOT NULL,
    [IdCostCenter]      SMALLINT   NOT NULL,
    [IdEmployee]        INT        NOT NULL,
    [IdReport]          INT        NOT NULL,
    [Amount]            DECIMAL(10, 2)  NOT NULL
);

