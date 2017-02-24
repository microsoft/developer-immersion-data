CREATE TABLE [dwh].[FactPurchase] (
    [IdPurchaseOrderItem] INT        NOT NULL,
    [IdPurchaseOrder]     INT        NOT NULL,
    [IdProduct]           INT        NOT NULL,
    [IdEmployee]          INT        NOT NULL,
    [IdCalendar]          INT        NOT NULL,
    [Price]               FLOAT (53) NOT NULL,
    [ItemsNumber]         INT        NOT NULL,
    [LineAmount]          FLOAT (53) NOT NULL
);

