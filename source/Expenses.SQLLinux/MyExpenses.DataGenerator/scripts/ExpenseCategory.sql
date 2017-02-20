SET IDENTITY_INSERT [Expense].[ExpenseCategory] ON 

INSERT [Expense].[ExpenseCategory] ([Id], [Title], [Description], [DefaultAmount]) VALUES (1, N'Accommodation', N'Expense related with accommodation', 30)
INSERT [Expense].[ExpenseCategory] ([Id], [Title], [Description], [DefaultAmount]) VALUES (2, N'Flights', N'Expense related with flights', 30)
INSERT [Expense].[ExpenseCategory] ([Id], [Title], [Description], [DefaultAmount]) VALUES (3, N'Highway', N'Expense related with highways', 30)
INSERT [Expense].[ExpenseCategory] ([Id], [Title], [Description], [DefaultAmount]) VALUES (4, N'Meals', N'Expense related with meals', 30)
INSERT [Expense].[ExpenseCategory] ([Id], [Title], [Description], [DefaultAmount]) VALUES (5, N'Trains', N'Expense related with trains', 30)
SET IDENTITY_INSERT [Expense].[ExpenseCategory] OFF