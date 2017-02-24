


 -- Row Level Security

 CREATE FUNCTION [Expense].fn_expensesReportsPredicate(@EmployeeId int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN 
SELECT 1 AS fn_accessResult 
FROM [Expense].[PermissionMap]
WHERE CONTEXT_INFO() = [Email]
    AND ([Id] = @EmployeeId
    OR 
            ([IsTeamManager] = 1 AND 
            [TeamId] = (SELECT TeamId 
                        FROM [Expense].[PermissionMap]
                        WHERE [Id] = @EmployeeId)
            )
        )