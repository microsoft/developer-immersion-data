CREATE TABLE [Audit].[WebAudit] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [Email]           NVARCHAR (60)  NOT NULL,
    [Path]            NVARCHAR (255) NULL,
    [RequestContent]  NVARCHAR (MAX) NULL,
    [Verb]            VARCHAR (10)   NULL,
    [ResponseCode]    NVARCHAR (3)   NULL,
    [ResponseContent] NVARCHAR (MAX) NULL,
    [Date]            DATETIME2 (7)  NOT NULL,
    PRIMARY KEY NONCLUSTERED ([Id] ASC)
)
WITH (MEMORY_OPTIMIZED = ON);

