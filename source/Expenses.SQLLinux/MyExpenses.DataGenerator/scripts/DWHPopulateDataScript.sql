INSERT INTO [dwh].[DimProduct]
           ([IdProduct]
           ,[Product]
           ,[Description]
           ,[Price]
           ,[Available]
           ,[IdCategory]
           ,[ProductCategory])

SELECT p.[Id] as IdProduct
      ,p.[Title] as Product
      ,[Description]
      ,[Price]
      ,[Available]
      ,[ProductCategoryId] as IdCategory
	  ,c.Title as ProductCategory
FROM  [Catalog].[Product] p
left join  [Catalog].[ProductCategory] c
	on p.[ProductCategoryId] = c.Id
 

INSERT INTO [dwh].[DimProduct]
           ([IdProduct]
           ,[Product]
           ,[Description]
           ,[Price]
           ,[Available]
           ,[IdCategory]
           ,[ProductCategory])
VALUES (-1, 'Unknown', 'Unknown', 0, 0, -1, 'Unknown')
 

INSERT INTO [dwh].[DimCostCenter]
           ([IdCostCenter]
           ,[CostCenter]
           ,[Description])
SELECT [Id] as IdCostCenter
      ,[Code] as CostCenter
      ,[Description]
FROM  [Expense].[CostCenter]

INSERT INTO [dwh].[DimCostCenter]
           ([IdCostCenter]
           ,[CostCenter]
           ,[Description])
VALUES (-1, 'Unknown', 'Unknown')
 

INSERT INTO [dwh].[DimEmployee]
           ([IdEmployee]
           ,[FirstName]
           ,[LastName]
           ,[Email]
           ,[Identifier]
           ,[JobTitle]
           ,[IdTeam]
           ,[TeamName]
           ,[IsTeamManager])

SELECT e.[Id] as IdEmployee
      ,[FirstName]
      ,[LastName]
      ,[Email]
      ,[Identifier]
      ,[JobTitle]
      ,[TeamId] as IdTeam
	  ,[TeamName]
      ,[IsTeamManager]
FROM  [Expense].[Employee] e
LEFT JOIN  [Expense].[Team] t
	on e.TeamId = t.Id

INSERT INTO [dwh].[DimEmployee]
           ([IdEmployee]
           ,[FirstName]
           ,[LastName]
           ,[Email]
           ,[Identifier]
           ,[JobTitle]
           ,[IdTeam]
           ,[TeamName]
           ,[IsTeamManager])
VALUES
	(-1, 'Unknown',  'Unknown',  'Unknown',  'Unknown',  'Unknown', -1,  'Unknown', 0) 
 

INSERT INTO [dwh].[DimExpenseCategory]
           ([IdExpenseCategory]
           ,[ExpenseCategory]
           ,[Description])
SELECT [Id] as IdExpenseCategory
      ,[Title] as ExpenseCategory
      ,[Description]
 FROM  [Expense].[ExpenseCategory]

 INSERT INTO [dwh].[DimExpenseCategory]
           ([IdExpenseCategory]
           ,[ExpenseCategory]
           ,[Description])
VALUES 
	(-1, 'Unknown', 'Unknown')



Declare @StartDate date
Set @StartDate = '20140101';

Declare @EndDate date
Set @EndDate = '20181231'; 

WITH CTE_Dates AS
(
SELECT @StartDate AS [Date]
UNION ALL
SELECT DATEADD(dd, 1, [Date]) FROM CTE_Dates WHERE DATEADD(dd, 1, [Date]) <= @EndDate
)

INSERT INTO [dwh].[DimCalendar]
		([IdCalendar]
		,[Date]
		,[MonthOfYear]
		,[MonthName]
		,[QuarterOfYear]
		,[QuarterName]
		,[Year]
		,[YearName]
		,[YearMonth]
		,[YearMonthName]
		,[YearQuarter]
		,[YearQuarterName])
 
SELECT CAST(CONVERT(VARCHAR(8), [Date], 112) AS INTEGER) as [IdCalendar]
	,[Date] as [Date]
	,MONTH([Date]) as [MonthOfYear]
	,DATENAME(MONTH, [Date]) as [MonthName]
	,DATEPART(QUARTER, [Date]) as [QuarterOfYear]
	,'Q' + Convert(varchar, DATEPART(QUARTER, [Date])) as [QuarterName]
	,YEAR([Date]) as [Year]
	,DATENAME(YEAR, [Date]) as [YearName]
	,YEAR([Date])*100 + MONTH([Date]) as [YearMonth]
	,DATENAME(YEAR, [Date]) + ' - ' + DATENAME(MONTH, [Date])  as [YearMonthName]
	,YEAR([Date])*10 + DATEPART(QUARTER, [Date]) as [YearQuarter]
	,DATENAME(YEAR, [Date]) + ' - ' + 'Q' + Convert(varchar, DATEPART(QUARTER, [Date]))  as [YearQuarterName]
FROM CTE_Dates

OPTION (MAXRECURSION 0);

Declare @Unknown date
Set @Unknown = '1900-01-01'

INSERT INTO [dwh].[DimCalendar]
			([IdCalendar]
			,[Date]
			,[MonthOfYear]
			,[MonthName]
			,[QuarterOfYear]
			,[QuarterName]
			,[Year]
			,[YearName]
			,[YearMonth]
			,[YearMonthName]
			,[YearQuarter]
			,[YearQuarterName])

	Select CAST(CONVERT(VARCHAR(8), @Unknown, 112) AS INTEGER) as [IdCalendar]
	,@Unknown as [Date] 
	,MONTH(@Unknown) as [MonthOfYear]
	,DATENAME(MONTH, @Unknown) as [MonthName]
	,DATEPART(QUARTER, @Unknown) as [QuarterOfYear]
	,'Q' + Convert(varchar, DATEPART(QUARTER, @Unknown)) as [QuarterName]
	,YEAR(@Unknown) as [Year]
	,DATENAME(YEAR, @Unknown) as [YearName]
	,YEAR(@Unknown)*100 + MONTH(@Unknown) as [YearMonth]
	,DATENAME(YEAR, @Unknown) + ' - ' + DATENAME(MONTH, @Unknown)  as [YearMonthName]
	,YEAR(@Unknown)*10 + DATEPART(QUARTER, @Unknown) as [YearQuarter]
	,DATENAME(YEAR, @Unknown) + ' - ' + 'Q' + Convert(varchar, DATEPART(QUARTER, @Unknown))  as [YearQuarterName]


INSERT INTO [dwh].[FactPurchase]
           ([IdPurchaseOrderItem]
           ,[IdPurchaseOrder]
           ,[IdProduct]
           ,[IdEmployee]
           ,[IdCalendar]
           ,[Price]
           ,[ItemsNumber]
           ,[LineAmount])

SELECT poi.[Id] as IdPurchaseOrderItem
      ,[PurchaseHistoryId] as IdPurchaseOrder
      ,IsNull(p.IdProduct, -1) as IdProduct
	  ,IsNull(e.IdEmployee, -1) as IdEmployee
	  ,IsNull(cal.IdCalendar, 19000101) as IdCalendar
      ,poi.[Price]
      ,[ItemsNumber]
	  ,poi.[Price] * [ItemsNumber] as LineAmount
FROM  [Purchase].[PurchaseOrderItem] poi
inner join  [Purchase].[PurchaseOrder] po
	on po.[Id] = poi.PurchaseHistoryId
left join [dwh].[DimProduct] p
	on poi.[ProductId] = p.IdProduct
left join [dwh].[DimEmployee] e
	on po.EmployeeId = e.IdEmployee
left join [dwh].[DimCalendar] cal
	on convert(int, convert(varchar(10), poi.[PurchaseDate], 112)) = cal.IdCalendar;

Declare @RowsToBeCreated int;
Set @RowsToBeCreated = 2000000;

WITH  L0 AS (SELECT 1 AS C UNION ALL SELECT 1)
,L1 AS (SELECT 1 AS C FROM L0 AS A, L0 AS B)
,L2 AS (SELECT 1 AS C FROM L1 AS A, L1 AS B)
,L3 AS (SELECT 1 AS C FROM L2 AS A, L2 AS B)
,L4 AS (SELECT 1 AS C FROM L3 AS A, L3 AS B)
,Tally AS (SELECT ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) AS N
 FROM L4) 

 INSERT INTO [dwh].[FactExpense]
           ([IdCalendar]
           ,[IdExpenseCategory]
           ,[IdCostCenter]
           ,[IdEmployee]
           ,[IdReport]
           ,[Amount]) 

 select TOP(@RowsToBeCreated)  
       P.IdCalendar
	,P.IdExpenseCategory
	,P.IdCostCenter
	,P.IdEmployee
	,P.IdReport
	,P.Amount
      FROM
 (
SELECT newid() as nuevoid, J.* FROM Tally CROSS JOIN
 (SELECT top(60)
         IsNull(cal.IdCalendar, 19000101) as IdCalendar
		,1+floor(5 * RAND(convert(varbinary, newid()))) as IdExpenseCategory
		,1+floor(2 * RAND(convert(varbinary, newid()))) as IdCostCenter
		,1+floor(100 * RAND(convert(varbinary, newid()))) as IdEmployee
		,[ExpenseReportId] as IdReport
		,Case when [Amount]> 9999999 then 10 else [Amount] * floor(5 * RAND(convert(varbinary, newid()))) End as Amount
		   FROM  [Expense].[Expense] e
		   left join [dwh].[DimCalendar] cal
				 on convert(int, convert(varchar(10), e.[Date], 112)) = cal.IdCalendar)	 AS J) AS P
	ORDER BY nuevoid				 	