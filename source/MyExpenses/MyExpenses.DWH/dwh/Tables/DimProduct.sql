CREATE TABLE [dwh].[DimProduct] (
    [IdProduct]       INT            NOT NULL,
    [Product]         NVARCHAR (50)  NOT NULL,
    [Description]     NVARCHAR (500) NOT NULL,
    [Price]           FLOAT (53)     NOT NULL,
    [Available]       BIT            NOT NULL,
    [IdCategory]      SMALLINT       NOT NULL,
    [ProductCategory] NVARCHAR (50)  NULL
);

