CREATE TABLE [Purchase].[AccountMovement] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [Movement]     FLOAT (53)     NOT NULL,
    [MovementDate] DATETIME2 (7)  NOT NULL,
    [Notes]        NVARCHAR (500) NULL,
    [EmployeeId]   INT            NOT NULL,
    CONSTRAINT [PK_Purchase.AccountMovements] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Purchase.AccountMovements_Purchase.EmployeePurchase_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Purchase].[EmployeePurchase] ([EmployeeId])
);


GO
CREATE NONCLUSTERED INDEX [IX_AccountId]
    ON [Purchase].[AccountMovement]([EmployeeId] ASC);

