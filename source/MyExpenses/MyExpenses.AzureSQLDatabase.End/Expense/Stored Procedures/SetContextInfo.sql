
CREATE PROCEDURE [Expense].[SetContextInfo]
    @Email NVARCHAR(60)
AS
BEGIN
    DECLARE @encodedEmail VARBINARY(128)
    SET @encodedEmail = convert(VARBINARY(128), @Email)
    SET CONTEXT_INFO @encodedEmail
END