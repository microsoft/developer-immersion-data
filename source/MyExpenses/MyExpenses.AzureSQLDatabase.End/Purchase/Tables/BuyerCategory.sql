CREATE TABLE [Purchase].[BuyerCategory] (
    [Id]                    SMALLINT      IDENTITY (1, 1) NOT NULL,
    [Name]                  NVARCHAR (50) NOT NULL,
    [MaxPointsInFiscalYear] FLOAT (53)    DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Purchase.BuyerCategories] PRIMARY KEY CLUSTERED ([Id] ASC)
);

