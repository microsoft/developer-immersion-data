CREATE TABLE [Catalog].[Product] (
    [Id]                    INT             IDENTITY (1, 1) NOT NULL,
    [Title]                 NVARCHAR (50)   NOT NULL,
    [Description]           NVARCHAR (500)  NOT NULL,
    [Price]                 FLOAT (53)      NOT NULL,
    [CreationDate]          DATETIME2 (7)   NOT NULL,
    [Available]             BIT             NOT NULL,
    [ProductCategoryId]     SMALLINT        NOT NULL,
    [LargePicture]          VARBINARY (MAX) NULL,
    [ThumbnailPicture]      VARBINARY (MAX) NULL,
    [AdditionalInformation] NVARCHAR (MAX)  NULL,
    CONSTRAINT [PK_Catalog.Products] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [AdditionalInformationMustBeJson] CHECK (isjson([AdditionalInformation])>(0)),
    CONSTRAINT [FK_Catalog.Products_Catalog.ProductCategories_ProductCategoryId] FOREIGN KEY ([ProductCategoryId]) REFERENCES [Catalog].[ProductCategory] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_ProductCategoryId]
    ON [Catalog].[Product]([ProductCategoryId] ASC);

