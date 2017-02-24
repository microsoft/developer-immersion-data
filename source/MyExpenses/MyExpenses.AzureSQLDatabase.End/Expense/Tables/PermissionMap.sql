CREATE TABLE [Expense].[PermissionMap] (
    [Id]            INT             IDENTITY (1, 1) NOT NULL,
    [EmployeeId]    INT             NOT NULL,
    [Email]         VARBINARY (128) NOT NULL,
    [TeamId]        INT             NOT NULL,
    [IsTeamManager] BIT             NOT NULL,
    CONSTRAINT [PermissionMap_PK] PRIMARY KEY NONCLUSTERED ([Id] ASC)
);

