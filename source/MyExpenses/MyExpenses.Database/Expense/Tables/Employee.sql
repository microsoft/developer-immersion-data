CREATE TABLE [Expense].[Employee] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [FirstName]     NVARCHAR (50) NOT NULL,
    [LastName]      NVARCHAR (50) NOT NULL,
    [Email]         NVARCHAR (60) NOT NULL,
    [Identifier]    NVARCHAR (50) NOT NULL,
    [JobTitle]      NVARCHAR (50) NOT NULL,
    [TeamId]        INT           NOT NULL,
    [IsTeamManager] BIT           NOT NULL,
	[BankAccountNumber] NVARCHAR(17) NOT NULL,
    CONSTRAINT [PK_Expenses.Employees] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expenses.Employees_Expenses.Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Expense].[Team] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_TeamId]
    ON [Expense].[Employee]([TeamId] ASC);

