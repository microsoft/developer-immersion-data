CREATE TABLE [Expense].[PermissionMap] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [EmployeeId]    INT           NOT NULL,
    [Email]         NVARCHAR (60) NOT NULL,
    [TeamId]        INT           NOT NULL,
    [isTeamManager] BIT           NOT NULL,
    CONSTRAINT [PermissionMap_PK] PRIMARY KEY NONCLUSTERED ([Id] ASC)
);

