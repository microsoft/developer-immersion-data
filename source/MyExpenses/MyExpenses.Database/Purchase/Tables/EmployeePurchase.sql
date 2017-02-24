CREATE TABLE [Purchase].[EmployeePurchase] (
    [EmployeeId]      INT      NOT NULL,
    [BuyerCategoryId] SMALLINT DEFAULT ((0)) NOT NULL,
    [Points]          FLOAT      NULL,
    CONSTRAINT [PK_Purchase.[EmployeePurchase] PRIMARY KEY CLUSTERED ([EmployeeId] ASC),
    CONSTRAINT [FK_Purchase.Buyers_Purchase.BuyerCategories_BuyerCategoryId] FOREIGN KEY ([BuyerCategoryId]) REFERENCES [Purchase].[BuyerCategory] ([Id]),
    CONSTRAINT [FK_Purchase.EmployeePurchase_Expense_Employees_Id] FOREIGN KEY ([EmployeeId]) REFERENCES [Expense].[Employee] ([Id])
);



