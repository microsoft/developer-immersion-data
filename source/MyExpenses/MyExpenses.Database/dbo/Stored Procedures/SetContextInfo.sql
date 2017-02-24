CREATE PROCEDURE SetContextInfo
	@Email VARCHAR(50)
AS
BEGIN
	DECLARE @encodedEmail VARBINARY(128)
	SET @encodedEmail = convert(VARBINARY(128), @Email)
	SET CONTEXT_INFO @encodedEmail
END