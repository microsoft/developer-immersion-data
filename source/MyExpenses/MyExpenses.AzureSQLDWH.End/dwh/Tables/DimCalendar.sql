CREATE TABLE [dwh].[DimCalendar] (
    [IdCalendar]      INT          NOT NULL,
    [Date]            DATE         NULL,
    [MonthOfYear]     SMALLINT     NULL,
    [MonthName]       VARCHAR (20) NULL,
    [QuarterOfYear]   SMALLINT     NULL,
    [QuarterName]     VARCHAR (20) NULL,
    [Year]            SMALLINT     NULL,
    [YearName]        VARCHAR (10) NULL,
    [YearMonth]       INT          NULL,
    [YearMonthName]   VARCHAR (30) NULL,
    [YearQuarter]     INT          NULL,
    [YearQuarterName] VARCHAR (30) NULL,
    CONSTRAINT [PK_DimCalendar] PRIMARY KEY CLUSTERED ([IdCalendar] ASC)
);

