CREATE TABLE [Catalog].[ProductCategory] (
    [Id]    SMALLINT      IDENTITY (1, 1) NOT NULL,
    [Title] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Catalog.ProductCategories] PRIMARY KEY CLUSTERED ([Id] ASC)
);

