CREATE TABLE [Purchase].[PurchaseOrderItem] (
    [Id]                INT           IDENTITY (1, 1) NOT NULL,
    [PurchaseHistoryId] INT           NOT NULL,
    [ProductId]         INT           NOT NULL,
    [ProductName]       NVARCHAR (50) NOT NULL,
    [Price]             FLOAT (53)    NOT NULL,
    [ItemsNumber]       INT           NOT NULL,
    [PurchaseDate]      DATETIME2 (7) NOT NULL,
    CONSTRAINT [PK_Purchase.PurchaseOrderItems] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Purchase.PurchaseOrderItems_Catalog.Product_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Catalog].[Product] ([Id]),
    CONSTRAINT [FK_Purchase.PurchaseOrderItems_Purchase.PurchaseOrders_PurchaseHistoryId] FOREIGN KEY ([PurchaseHistoryId]) REFERENCES [Purchase].[PurchaseOrder] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_PurchaseHistoryId]
    ON [Purchase].[PurchaseOrderItem]([PurchaseHistoryId] ASC);

