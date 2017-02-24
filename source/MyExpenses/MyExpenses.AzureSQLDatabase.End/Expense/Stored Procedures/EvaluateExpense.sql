

CREATE PROCEDURE [Expense].EvaluateExpense 
@ExpenseId NVARCHAR(50),
@threshold float = 0.8
AS
BEGIN
SET NOCOUNT ON;

if not exists (select * from sysobjects where name='TemporalSuspiciousExpense' and xtype='U')
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