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