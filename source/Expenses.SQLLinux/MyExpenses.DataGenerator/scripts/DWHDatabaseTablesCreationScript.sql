CREATE SCHEMA [Catalog]
GO

CREATE SCHEMA [Expense]
GO

CREATE SCHEMA [Expenses]
GO

CREATE SCHEMA [Purchase]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Catalog].[Product](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](500) NOT NULL,
	[Price] [float] NOT NULL,
	[CreationDate] [datetime2](7) NOT NULL,
	[Available] [bit] NOT NULL,
	[ProductCategoryId] [smallint] NOT NULL,
	[LargePicture] [varbinary](max) NULL,
	[ThumbnailPicture] [varbinary](max) NULL,
 CONSTRAINT [PK_Catalog.Products] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Catalog].[ProductCategory](
	[Id] [smallint] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Catalog.ProductCategories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[Bonification](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Amount] [float] NOT NULL,
	[Enabled] [bit] NOT NULL,
	[Description] [nvarchar](200) NOT NULL,
	[From] [datetime2](7) NOT NULL,
	[To] [datetime2](7) NOT NULL,
	[EmployeeId] [int] NOT NULL,
	[ExpenseCategoryId] [smallint] NOT NULL,
 CONSTRAINT [PK_Expenses.Bonifications] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[CostCenter](
	[Id] [smallint] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](200) NULL,
 CONSTRAINT [PK_Expenses.CostCenters] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[Employee](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](60) NOT NULL,
	[Identifier] [nvarchar](50) NOT NULL,
	[JobTitle] [nvarchar](50) NOT NULL,
	[TeamId] [int] NOT NULL,
	[IsTeamManager] [bit] NOT NULL,
	[BankAccountNumber] [nvarchar](17) NOT NULL,
 CONSTRAINT [PK_Expenses.Employees] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[Expense](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EnabledFrom] [datetime2](7) NULL,
	[EnabledTo] [datetime2](7) NULL,
	[Title] [nvarchar](50) NOT NULL,
	[Notes] [nvarchar](250) NULL,
	[Amount] [float] NOT NULL,
	[ExpenseReportId] [int] NOT NULL,
	[ExpenseCategoryId] [smallint] NOT NULL,
	[ReceiptPicture] [varbinary](max) NULL,
	[Date] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Expenses.Expenses] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[ExpenseBonus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Amount] [float] NOT NULL,
	[Reason] [nvarchar](250) NOT NULL,
	[ExpenseId] [int] NOT NULL,
 CONSTRAINT [PK_Expenses.ExpenseBonus] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[ExpenseCategory](
	[Id] [smallint] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NOT NULL,
	[DefaultAmount] [float] NOT NULL,
 CONSTRAINT [PK_Expenses.ExpenseCategories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[ExpenseReport](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CostCenterId] [smallint] NOT NULL,
	[Purpose] [nvarchar](250) NOT NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[EmployeeId] [int] NOT NULL,
	[Status] [smallint] NOT NULL,
	[Description] [nvarchar](255) NULL,
	[SequenceNumber]  AS ((('ER'+CONVERT([nvarchar](max),[EmployeeId]))+'-')+CONVERT([nvarchar](max),[Id])),
	[Summary] [nvarchar](250) NULL,
	[SubmissionDate] [datetime2](7) NULL,
	[ReimburseInPoints] [bit] NOT NULL,
	[VersionTimeStamp] [timestamp] NOT NULL,
 CONSTRAINT [PK_Expenses.ExpenseReports] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[PermissionMap](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeId] [int] NOT NULL,
	[Email] [nvarchar](60) NOT NULL,
	[TeamId] [int] NOT NULL,
	[isTeamManager] [bit] NOT NULL,
 CONSTRAINT [PermissionMap_PK] PRIMARY KEY NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[Picture](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PictureType] [smallint] NOT NULL,
	[EmployeeId] [int] NOT NULL,
	[Content] [varbinary](max) NOT NULL,
 CONSTRAINT [PK_Expenses.Pictures] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[PredictionModel](
	[model] [varbinary](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[SuspiciousExpense](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SuspiciousExpenseId] [int] NOT NULL,
 CONSTRAINT [PK_SuspiciousExpense] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Expense].[Team](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TeamName] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_Expenses.Teams] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Purchase].[AccountMovement](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Movement] [float] NOT NULL,
	[MovementDate] [datetime2](7) NOT NULL,
	[Notes] [nvarchar](500) NULL,
	[EmployeeId] [int] NOT NULL,
 CONSTRAINT [PK_Purchase.AccountMovements] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Purchase].[BuyerCategory](
	[Id] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[MaxPointsInFiscalYear] [float] NOT NULL,
 CONSTRAINT [PK_Purchase.BuyerCategories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Purchase].[EmployeePurchase](
	[EmployeeId] [int] NOT NULL,
	[BuyerCategoryId] [smallint] NOT NULL,
	[Points] [float] NULL,
 CONSTRAINT [PK_Purchase.[EmployeePurchase] PRIMARY KEY CLUSTERED 
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Purchase].[PurchaseOrder](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeId] [int] NOT NULL,
 CONSTRAINT [PK_Purchase.PurchaseOrders] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Purchase].[PurchaseOrderItem](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseHistoryId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[ProductName] [nvarchar](50) NOT NULL,
	[Price] [float] NOT NULL,
	[ItemsNumber] [int] NOT NULL,
	[PurchaseDate] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Purchase.PurchaseOrderItems] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

CREATE NONCLUSTERED INDEX [IX_ProductCategoryId] ON [Catalog].[Product]
(
	[ProductCategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_EmployeeId] ON [Expense].[Bonification]
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_ExpenseCategoryId] ON [Expense].[Bonification]
(
	[ExpenseCategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_TeamId] ON [Expense].[Employee]
(
	[TeamId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_ExpenseCategoryId] ON [Expense].[Expense]
(
	[ExpenseCategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_ExpenseReportId] ON [Expense].[Expense]
(
	[ExpenseReportId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_ExpenseId] ON [Expense].[ExpenseBonus]
(
	[ExpenseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_CostCenterId] ON [Expense].[ExpenseReport]
(
	[CostCenterId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_EmployeeId] ON [Expense].[ExpenseReport]
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_EmployeeId] ON [Expense].[Picture]
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_AccountId] ON [Purchase].[AccountMovement]
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_BuyerId] ON [Purchase].[PurchaseOrder]
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [IX_PurchaseHistoryId] ON [Purchase].[PurchaseOrderItem]
(
	[PurchaseHistoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [Expense].[Expense] ADD  DEFAULT ('1900-01-01T00:00:00.000') FOR [Date]
GO
ALTER TABLE [Expense].[ExpenseReport] ADD  DEFAULT ((0)) FOR [ReimburseInPoints]
GO
ALTER TABLE [Purchase].[BuyerCategory] ADD  DEFAULT ((0)) FOR [MaxPointsInFiscalYear]
GO
ALTER TABLE [Purchase].[EmployeePurchase] ADD  DEFAULT ((0)) FOR [BuyerCategoryId]
GO
ALTER TABLE [Catalog].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Catalog.Products_Catalog.ProductCategories_ProductCategoryId] FOREIGN KEY([ProductCategoryId])
REFERENCES [Catalog].[ProductCategory] ([Id])
GO
ALTER TABLE [Catalog].[Product] CHECK CONSTRAINT [FK_Catalog.Products_Catalog.ProductCategories_ProductCategoryId]
GO
ALTER TABLE [Expense].[Bonification]  WITH CHECK ADD  CONSTRAINT [FK_Expense.Bonifications_Expense.Employees_EmployeeId] FOREIGN KEY([EmployeeId])
REFERENCES [Expense].[Employee] ([Id])
GO
ALTER TABLE [Expense].[Bonification] CHECK CONSTRAINT [FK_Expense.Bonifications_Expense.Employees_EmployeeId]
GO
ALTER TABLE [Expense].[Bonification]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.Bonifications_Expenses.Employees_EmployeeId] FOREIGN KEY([EmployeeId])
REFERENCES [Expense].[Employee] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[Bonification] CHECK CONSTRAINT [FK_Expenses.Bonifications_Expenses.Employees_EmployeeId]
GO
ALTER TABLE [Expense].[Bonification]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.Bonifications_Expenses.ExpenseCategories_ExpenseCategoryId] FOREIGN KEY([ExpenseCategoryId])
REFERENCES [Expense].[ExpenseCategory] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[Bonification] CHECK CONSTRAINT [FK_Expenses.Bonifications_Expenses.ExpenseCategories_ExpenseCategoryId]
GO
ALTER TABLE [Expense].[Employee]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.Employees_Expenses.Teams_TeamId] FOREIGN KEY([TeamId])
REFERENCES [Expense].[Team] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[Employee] CHECK CONSTRAINT [FK_Expenses.Employees_Expenses.Teams_TeamId]
GO
ALTER TABLE [Expense].[Expense]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.Expenses_Expenses.ExpenseCategories_ExpenseCategoryId] FOREIGN KEY([ExpenseCategoryId])
REFERENCES [Expense].[ExpenseCategory] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[Expense] CHECK CONSTRAINT [FK_Expenses.Expenses_Expenses.ExpenseCategories_ExpenseCategoryId]
GO
ALTER TABLE [Expense].[Expense]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.Expenses_Expenses.ExpenseReports_ExpenseReportId] FOREIGN KEY([ExpenseReportId])
REFERENCES [Expense].[ExpenseReport] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[Expense] CHECK CONSTRAINT [FK_Expenses.Expenses_Expenses.ExpenseReports_ExpenseReportId]
GO
ALTER TABLE [Expense].[ExpenseBonus]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.ExpenseBonus_Expenses.Expenses_ExpenseId] FOREIGN KEY([ExpenseId])
REFERENCES [Expense].[Expense] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[ExpenseBonus] CHECK CONSTRAINT [FK_Expenses.ExpenseBonus_Expenses.Expenses_ExpenseId]
GO
ALTER TABLE [Expense].[ExpenseReport]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.ExpenseReports_Expenses.CostCenters_CostCenterId] FOREIGN KEY([CostCenterId])
REFERENCES [Expense].[CostCenter] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[ExpenseReport] CHECK CONSTRAINT [FK_Expenses.ExpenseReports_Expenses.CostCenters_CostCenterId]
GO
ALTER TABLE [Expense].[ExpenseReport]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.ExpenseReports_Expenses.Employees_EmployeeId] FOREIGN KEY([EmployeeId])
REFERENCES [Expense].[Employee] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[ExpenseReport] CHECK CONSTRAINT [FK_Expenses.ExpenseReports_Expenses.Employees_EmployeeId]
GO
ALTER TABLE [Expense].[Picture]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.Pictures_Expenses.Employees_EmployeeId] FOREIGN KEY([EmployeeId])
REFERENCES [Expense].[Employee] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Expense].[Picture] CHECK CONSTRAINT [FK_Expenses.Pictures_Expenses.Employees_EmployeeId]
GO
ALTER TABLE [Expense].[SuspiciousExpense]  WITH CHECK ADD  CONSTRAINT [FK_SuspiciousExpense_Expense] FOREIGN KEY([SuspiciousExpenseId])
REFERENCES [Expense].[Expense] ([Id])
GO
ALTER TABLE [Expense].[SuspiciousExpense] CHECK CONSTRAINT [FK_SuspiciousExpense_Expense]
GO
ALTER TABLE [Purchase].[AccountMovement]  WITH CHECK ADD  CONSTRAINT [FK_Purchase.AccountMovements_Purchase.EmployeePurchase_EmployeeId] FOREIGN KEY([EmployeeId])
REFERENCES [Purchase].[EmployeePurchase] ([EmployeeId])
GO
ALTER TABLE [Purchase].[AccountMovement] CHECK CONSTRAINT [FK_Purchase.AccountMovements_Purchase.EmployeePurchase_EmployeeId]
GO
ALTER TABLE [Purchase].[EmployeePurchase]  WITH CHECK ADD  CONSTRAINT [FK_Purchase.Buyers_Purchase.BuyerCategories_BuyerCategoryId] FOREIGN KEY([BuyerCategoryId])
REFERENCES [Purchase].[BuyerCategory] ([Id])
GO
ALTER TABLE [Purchase].[EmployeePurchase] CHECK CONSTRAINT [FK_Purchase.Buyers_Purchase.BuyerCategories_BuyerCategoryId]
GO
ALTER TABLE [Purchase].[EmployeePurchase]  WITH CHECK ADD  CONSTRAINT [FK_Purchase.EmployeePurchase_Expense_Employees_Id] FOREIGN KEY([EmployeeId])
REFERENCES [Expense].[Employee] ([Id])
GO
ALTER TABLE [Purchase].[EmployeePurchase] CHECK CONSTRAINT [FK_Purchase.EmployeePurchase_Expense_Employees_Id]
GO
ALTER TABLE [Purchase].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_Purchase.PurchaseOrders_Purchase.EmployeePurchase_EmployeeId] FOREIGN KEY([EmployeeId])
REFERENCES [Purchase].[EmployeePurchase] ([EmployeeId])
GO
ALTER TABLE [Purchase].[PurchaseOrder] CHECK CONSTRAINT [FK_Purchase.PurchaseOrders_Purchase.EmployeePurchase_EmployeeId]
GO
ALTER TABLE [Purchase].[PurchaseOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_Purchase.PurchaseOrderItems_Catalog.Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [Catalog].[Product] ([Id])
GO
ALTER TABLE [Purchase].[PurchaseOrderItem] CHECK CONSTRAINT [FK_Purchase.PurchaseOrderItems_Catalog.Product_ProductId]
GO
ALTER TABLE [Purchase].[PurchaseOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_Purchase.PurchaseOrderItems_Purchase.PurchaseOrders_PurchaseHistoryId] FOREIGN KEY([PurchaseHistoryId])
REFERENCES [Purchase].[PurchaseOrder] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [Purchase].[PurchaseOrderItem] CHECK CONSTRAINT [FK_Purchase.PurchaseOrderItems_Purchase.PurchaseOrders_PurchaseHistoryId]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [Expense].[EvaluateExpense] 
	@ExpenseId NVARCHAR(50),
	@threshold float = 0.8
AS
BEGIN
	SET NOCOUNT ON;

	CREATE TABLE TemporalSuspiciousExpense(id int,Amount float, ExpenseCategoryId int ,[no] float ,yes float)

	DECLARE @model varbinary(max) = (SELECT TOP 1 Model FROM Expense.PredictionModel);
	
	
	DECLARE @query nvarchar(500) = N'SELECT e.Id, e.Amount, e.ExpenseCategoryId FROM [Expense].[Expense] e WHERE e.Id = '+ @ExpenseId


	INSERT INTO TemporalSuspiciousExpense
	exec sp_execute_external_script  @language =N'R',    
	@script=N'
	model <- unserialize(model)
	test<-InputDataSet	
	pred.tree <- predict(model,test)
	output<-cbind(test,pred.tree)
	OutputDataSet<-cbind(test,pred.tree)',      
	@input_data_1 =@query,
	@params =N'@model varbinary(max)',
	@model = @model


	MERGE Expense.SuspiciousExpense as target
	USING(select Id from TemporalSuspiciousExpense WHERE yes > @threshold) as source
	ON (source.Id= target.SuspiciousExpenseId)
	WHEN NOT MATCHED THEN
		INSERT (SuspiciousExpenseId)
		VALUES (source.Id);
	

	DROP TABLE TemporalSuspiciousExpense

	SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS IsSuspicious
	FROM Expense.SuspiciousExpense
	WHERE SuspiciousExpenseId = @ExpenseId

END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [Expense].[SetContextInfo]
	@Email VARCHAR(50)
AS
BEGIN
	DECLARE @encodedEmail VARBINARY(128)
	SET @encodedEmail = convert(VARBINARY(128), @Email)
	SET CONTEXT_INFO @encodedEmail
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [Expense].[TrainSuspiciousExpensesModel]
AS
BEGIN

TRUNCATE TABLE [Expense].[PredictionModel]

INSERT INTO [Expense].[PredictionModel]
exec sp_execute_external_script  @language =N'R',    
@script=N'
model.tree <- rpart (IsSuspicious~.,data=InputDataSet,method="class")	
trainedmodel<-data.frame(payload = as.raw(serialize(model.tree,connection=NULL)))
OutputDataSet<-trainedmodel',      
@input_data_1 =N'SELECT Amount, ExpenseCategoryId,
CASE
	WHEN se.SuspiciousExpenseId is not null
	THEN 1
	ELSE 0
	END as IsSuspicious
FROM [Expense].[Expense] e
LEFT JOIN Expense.SuspiciousExpense se
on e.Id = se.SuspiciousExpenseId'

END
GO

ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO

CREATE SCHEMA [config]
GO

CREATE SCHEMA [dwh]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dwh].[DimCalendar](
	[IdCalendar] [int] NOT NULL,
	[Date] [date] NULL,
	[MonthOfYear] [smallint] NULL,
	[MonthName] [varchar](20) NULL,
	[QuarterOfYear] [smallint] NULL,
	[QuarterName] [varchar](20) NULL,
	[Year] [smallint] NULL,
	[YearName] [varchar](10) NULL,
	[YearMonth] [int] NULL,
	[YearMonthName] [varchar](30) NULL,
	[YearQuarter] [int] NULL,
	[YearQuarterName] [varchar](30) NULL,
 CONSTRAINT [PK_DimCalendar] PRIMARY KEY CLUSTERED 
(
	[IdCalendar] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dwh].[DimCostCenter](
	[IdCostCenter] [smallint] NOT NULL,
	[CostCenter] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](200) NULL
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dwh].[DimEmployee](
	[IdEmployee] [int] NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](60) NOT NULL,
	[Identifier] [nvarchar](50) NOT NULL,
	[JobTitle] [nvarchar](50) NOT NULL,
	[IdTeam] [int] NOT NULL,
	[TeamName] [nvarchar](100) NULL,
	[IsTeamManager] [bit] NOT NULL
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dwh].[DimExpenseCategory](
	[IdExpenseCategory] [smallint] NOT NULL,
	[ExpenseCategory] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NOT NULL
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dwh].[DimProduct](
	[IdProduct] [int] NOT NULL,
	[Product] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](500) NOT NULL,
	[Price] [float] NOT NULL,
	[Available] [bit] NOT NULL,
	[IdCategory] [smallint] NOT NULL,
	[ProductCategory] [nvarchar](50) NULL
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dwh].[FactExpense](
	[IdExpense] [int] IDENTITY(1,1) NOT NULL,
	[IdCalendar] [int] NOT NULL,
	[IdExpenseCategory] [smallint] NOT NULL,
	[IdCostCenter] [smallint] NOT NULL,
	[IdEmployee] [int] NOT NULL,
	[IdReport] [int] NOT NULL,
	[Amount] DECIMAL(10, 2) NOT NULL
) ON [PRIMARY]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dwh].[FactPurchase](
	[IdPurchaseOrderItem] [int] NOT NULL,
	[IdPurchaseOrder] [int] NOT NULL,
	[IdProduct] [int] NOT NULL,
	[IdEmployee] [int] NOT NULL,
	[IdCalendar] [int] NOT NULL,
	[Price] [float] NOT NULL,
	[ItemsNumber] [int] NOT NULL,
	[LineAmount] [float] NOT NULL
) ON [PRIMARY]

GO

