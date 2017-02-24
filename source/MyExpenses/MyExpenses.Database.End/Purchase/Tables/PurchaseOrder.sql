CREATE TABLE [Purchase].[PurchaseOrder] (
    [Id]         INT IDENTITY (1, 1) NOT NULL,
    [EmployeeId] INT NOT NULL,
    CONSTRAINT [PK_Purchase.PurchaseOrders] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Purchase.PurchaseOrders_Purchase.EmployeePurchase_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Purchase].[EmployeePurchase] ([EmployeeId])
);


GO
CREATE NONCLUSTERED INDEX [IX_BuyerId]
    ON [Purchase].[PurchaseOrder]([EmployeeId] ASC);

