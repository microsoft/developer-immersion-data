SET IDENTITY_INSERT [Expense].[CostCenter] ON 

INSERT [Expense].[CostCenter] ([Id], [Code], [Description]) VALUES (1, N'MADRID', N'Cost center related to MADRID office')
INSERT [Expense].[CostCenter] ([Id], [Code], [Description]) VALUES (2, N'SEATTLE', N'Cost center related to SEATTLE office')
SET IDENTITY_INSERT [Expense].[CostCenter] OFF