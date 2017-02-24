CREATE TABLE [dwh].[DimEmployee] (
    [IdEmployee]    INT            NOT NULL,
    [FirstName]     NVARCHAR (50)  NOT NULL,
    [LastName]      NVARCHAR (50)  NOT NULL,
    [Email]         NVARCHAR (60)  NOT NULL,
    [Identifier]    NVARCHAR (50)  NOT NULL,
    [JobTitle]      NVARCHAR (50)  NOT NULL,
    [IdTeam]        INT            NOT NULL,
    [TeamName]      NVARCHAR (100) NULL,
    [IsTeamManager] BIT            NOT NULL
);

