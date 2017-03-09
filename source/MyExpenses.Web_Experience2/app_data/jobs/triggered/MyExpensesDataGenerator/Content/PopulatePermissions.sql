INSERT INTO Expense.PermissionMap
(EmployeeId, Email, TeamId, isTeamManager)
SELECT Id, CONVERT(VARBINARY(128), Email), TeamId, IsTeamManager
FROM [Expense].[Employee]