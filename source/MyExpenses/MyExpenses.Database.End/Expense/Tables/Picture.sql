CREATE TABLE [Expense].[Picture] (
    [Id]          INT             IDENTITY (1, 1) NOT NULL,
    [PictureType] SMALLINT        NOT NULL,
    [EmployeeId]  INT             NOT NULL,
    [Content]     VARBINARY (MAX) NOT NULL,
    CONSTRAINT [PK_Expenses.Pictures] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expenses.Pictures_Expenses.Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Expense].[Employee] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_EmployeeId]
    ON [Expense].[Picture]([EmployeeId] ASC);

