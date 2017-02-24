CREATE TABLE [Audit].[WebAudit](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NONCLUSTERED NOT NULL,
	[Email] [NVARCHAR](60) NOT NULL,
	[Path] [nvarchar](255) NULL,
	[RequestContent] [nvarchar](max) NULL,
	[Verb] [varchar](10) NULL,
	[ResponseCode] [nvarchar](3) NULL,
	[ResponseContent] [nvarchar](max) NULL,
	[Date] datetime2(7) NOT NULL)
