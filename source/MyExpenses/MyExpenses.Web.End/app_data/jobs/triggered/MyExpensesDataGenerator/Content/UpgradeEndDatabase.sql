USE [Expenses.End]

-- DDM

-- Always Encrypted
CREATE COLUMN MASTER KEY alwaysEncryptedColumnMasterKey  
WITH (  
 KEY_STORE_PROVIDER_NAME = 'MSSQL_CERTIFICATE_STORE',   
 KEY_PATH = N'CurrentUser/My/68A1CDC6EDBC5DB197FB33477E971EEAE0D0605B'  
);  

CREATE COLUMN ENCRYPTION KEY alwaysEncryptedColumnEncryptionKey   
WITH VALUES  
(  
    COLUMN_MASTER_KEY = alwaysEncryptedColumnMasterKey,   
    ALGORITHM = 'RSA_OAEP',   
    ENCRYPTED_VALUE = 0x016E000001630075007200720065006E00740075007300650072002F006D0079002F003600380061003100630064006300360065006400620063003500640062003100390037006600620033003300340037003700650039003700310065006500610065003000640030003600300035006200239E0ECF412CF86A11933F5C03C0FE93F87C54E8D8267B888D0F06C805937734B126FA8DF975734A83993CA4253259DEC50A676DAAB33205891273CFB336C52A6705FDB4D6099B6BB9A5F0F4DF60A799DC9870A0066EECCE8736F0B02A48A930761D1CBE1F590B7A2BB5D6B26508EF3E15441F52DD474B67A0A599436D533C9E69DEBEF1B56DEE910CDE81E8CE2884201F9E4C91F890ED27729A7CE21F849455FAA4374935B3A45D9D1A59E69B0E94750F0ADE91D532775CA7DFFFD00A623D04812F5153EF86887F12E5B557CA5CD883B340D4F8016DBA0ADB8CA74167FB84ABBFCABA1059A1BD97A3EDA8FBEA42AC8FBCC216EE1CA658A2769D5DB3174DD48D562E0206331D8C6C1B81592839115E87DC40BE9798B592BF22D07A0EAD7E2971559D2B9CB49F12A1F574AF76EC3314B750A87CC3CE1052C4D0F6D845705DC18E32AE43DC56C35373A5DA15D13235CAA37765C2F283D2F9547279CC2118E7CE4B3471BD735DA6C5125BAB2609DE10BEFFF7A2F83119681DC175F15E13B6D2E15D9C909340D271F345DE4F2C04E85A33F0399319595F5956AC0354E47186DC598F0AB5364A5456D992A551CF538AFEF40EE449A235E66DE57BFA991442CB07145318A81E81150D346A099909C14BB6A418FDD8744D2C42832C2DD5740E6AA54DCE9AC405D7E2C9F71F7F8542DDC5388C42949F27590FFB1F8A9B0275A447E3D208  
); 


-- In Memory OLTP

  ALTER DATABASE [Expenses.End]
        ADD FILEGROUP MEMORYOPTIMIZATIONFG  
        CONTAINS MEMORY_OPTIMIZED_DATA;  

    GO

    ALTER DATABASE [Expenses.End]
        ADD FILE  
        (  
        NAME = N'FileMemOptima',  
        FILENAME = N'c:\FileMemOptimization'  
        )  
    TO FILEGROUP MEMORYOPTIMIZATIONFG;
	GO



	DROP PROCEDURE [Audit].[usp_Audit]
	DROP TABLE [Audit].[WebAudit]

	CREATE TABLE [Audit].[WebAudit](
    [Id] [int] IDENTITY(1,1) PRIMARY KEY NONCLUSTERED NOT NULL,
    [Email] [nvarchar](60) NOT NULL,
    [Path] [nvarchar](255) NULL,
    [RequestContent] [nvarchar](max) NULL,
    [Verb] [varchar](10) NULL,
    [ResponseCode] [nvarchar](3) NULL,
    [ResponseContent] [nvarchar](max) NULL,
    [Date] [datetime2](7) NOT NULL
) WITH (MEMORY_OPTIMIZED=ON);

GO

    CREATE PROCEDURE [Audit].usp_Audit
        @Email [nvarchar](60),
        @Path [nvarchar](255), 
        @RequestContent [nvarchar](max),
        @Verb [varchar](10),
        @ResponseCode [nvarchar](3),
        @ResponseContent [nvarchar](max)  
        WITH NATIVE_COMPILATION, SCHEMABINDING   
        AS   
        BEGIN ATOMIC   
            WITH (TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'us_english')  
            INSERT INTO [Audit].[WebAudit]([Email], [Path], [RequestContent], [Verb], [ResponseCode], [ResponseContent], [Date])
            VALUES (@Email, @Path, @RequestContent, @Verb, @ResponseCode, @ResponseContent, GETDATE())  
        END
    GO

-- JSON support

ALTER TABLE [Catalog].[Product]
ADD AdditionalInformation NVARCHAR(max) NULL
CONSTRAINT AdditionalInformationMustBeJson
CHECK (ISJSON(AdditionalInformation) > 0)
GO 

UPDATE [Catalog].[Product]
    SET [AdditionalInformation] = N'
        {
            "Data": {
                "baseImgUrl": "http://thegamesdb.net/banners/",
                "Game": {
                    "id": "17810",
                    "GameTitle": "Dead Rising 3",
                    "PlatformId": "4920",
                    "Platform": "Microsoft Xbox One",
                    "ReleaseDate": "11/22/2013",
                    "Overview": "Dead Rising 3 is a survival horror video game developed by Capcom Vancouver and published by Microsoft Studios.[1] It was released as a launch title for the Xbox One platform on November 22, 2013; a Microsoft Windows port is due for release on September 5, 2014. The game wa announced as an Xbox One exclusive during Microsoft''s E3 2013 press conference on June 10, 2013.[5]",
                    "ESRB": "M - Mature",
                    "Genres": {
                        "genre": [
                            "Action",
                            "Horror",
                            "Sandbox"
                        ]
                    },
                    "Co-op": "No",
                    "Publisher": "Capcom",
                    "Developer": "Capcom",
                    "Similar": {
                        "SimilarCount": "1",
                        "Game": {
                            "id": "22651",
                            "PlatformId": "1"
                        }
                    },
                    "Images": {
                        "boxart": {
                            "-side": "front",
                            "-width": "360",
                            "-height": "456",
                            "-thumb": "boxart/thumb/original/front/17810-1.jpg",
                            "#text": "boxart/original/front/17810-1.jpg"
                        }
                    }
                }
            }
        }
    '
    WHERE [Title] = 'Dead Rising 3 for Xbox One'
    GO

	UPDATE [Catalog].[Product]
SET [AdditionalInformation] = N'
{
    "Data": {
        "baseImgUrl": "http://thegamesdb.net/banners/",
        "Game": {
            "id": "17096",
            "GameTitle": "Forza Motorsport 5",
            "PlatformId": "4920",
            "Platform": "Microsoft Xbox One",
            "ReleaseDate": "11/22/2013",
            "Overview": "Forza Motorsport 5 is a racing video game that was released on the Xbox One on the day of its launch. The game was revealed on May 21, 2013 during the Xbox One reveal event with a teaser trailer that showed an orange McLaren P1 racing against a silver McLaren F1. On August 15, 2013, Forza Motorsport 5 Limited Edition was announced, and includes multiple car packs and a VIP membership for the game.",
            "ESRB": "E - Everyone",
            "Genres": {
                "genre": "Racing"
            },
            "Players": "4+",
            "Co-op": "No",
            "Youtube": "http://www.youtube.com/watch?v=r46D1lRpO1k",
            "Publisher": "Microsoft Studios",
            "Developer": "Turn 10 Studios",
            "Rating": "9",
            "Images": {
                "boxart": {
                    "-side": "front",
                    "-width": "1034",
                    "-height": "1344",
                    "-thumb": "boxart/thumb/original/front/17096-1.jpg",
                    "#text": "boxart/original/front/17096-1.jpg"
                }
            }
        }
    }
}
'
WHERE [Title] = 'Forza motorsport 5'
GO


DECLARE @jsonNewProduct NVARCHAR(MAX) = N'
{
"Title": "Halo 5: Guardians",
"Description":"The last release of the famous first-person shooter video game.",
"Price": 59.99,
"CreationDate": "2016-09-12",
"Available": 1,
"ProductCategoryId": 3,
"AdditionalInformation": {
		"Data": {
			"baseImgUrl": "http://thegamesdb.net/banners/",
			"Game": {
				"id": "21335",
				"GameTitle": "Halo 5: Guardians",
				"PlatformId": "4920",
				"Platform": "Microsoft Xbox One",
				"ReleaseDate": "10/27/2015",
				"Overview": "343 Industries continues the legendary first-person shooter series with Halo 5: Guardians -- the first Halo title for the Xbox One gaming platform. Halo 5 featuresthe most ambitious campaign and multiplayer experience in franchise history, all running at 60 frames per second on dedicated servers. A mysterious and unstoppable force threatens the galaxy, the Master Chief is missing and his loyalty questioned. Experience the most dramatic Halo story to date through the eyes of the Master Chief and Blue Team, and Spartan Locke and Fireteam Osiris – in a 4-player cooperative epic that spans three worlds. Challenge friends and rivals in new multiplayer modes: Warzone (massive 24-player battles featuring AI enemies and allies,) and Arena (pure 4-vs-4 competitive combat.)",
				"Genres": {
					"genre": [
						"Action",
						"Shooter"
					]
				},
				"Players": "4+",
				"Co-op": "Yes",
				"Youtube": "http://www.youtube.com/watch?v=HnOX28WaRrE",
				"Publisher": "Microsoft Studios",
				"Developer": "343 Industries",
				"Rating": "8",
				"Images": {
					"fanart": {
						"original": {
							"-width": "1920",
							"-height": "1080",
							"#text": "fanart/original/21335-1.jpg"
						},
						"thumb": "fanart/thumb/21335-1.jpg"
					},
					"boxart": {
						"-side": "front",
						"-width": "771",
						"-height": "1080",
						"-thumb": "boxart/thumb/original/front/21335-1.jpg",
						"#text": "boxart/original/front/21335-1.jpg"
					},
					"screenshot": {
						"original": {
							"-width": "1920",
							"-height": "1080",
							"#text": "screenshots/21335-1.jpg"
						},
						"thumb": "screenshots/thumb/21335-1.jpg"
					}
				}
			}
		}
	}
}';
IF ISJSON(@jsonNewProduct) > 0
BEGIN
	INSERT INTO [Catalog].[Product]
	SELECT * FROM OPENJSON(@jsonNewProduct)
	WITH(
		[Title] NVARCHAR(50),
		[Description] NVARCHAR(500),
		[Price] FLOAT,
		[CreationDate] DATETIME2(7),
		[Available] BIT,
		[ProductCategoryId] SMALLINT,
		[LargePicture] VARBINARY(MAX),
		[ThumbnailPicture] VARBINARY(MAX),
		[AdditionalInformation] NVARCHAR(MAX) AS JSON
	);
END;
GO

-- R Services
ALTER PROCEDURE [Expense].[TrainSuspiciousExpensesModel]
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

GO
DECLARE @VarDecimalSupported AS BIT;

SELECT @VarDecimalSupported = 0;

IF ((ServerProperty(N'EngineEdition') = 3)
    AND (((@@microsoftversion / power(2, 24) = 9)
          AND (@@microsoftversion & 0xffff >= 3024))
         OR ((@@microsoftversion / power(2, 24) = 10)
             AND (@@microsoftversion & 0xffff >= 1600))))
    SELECT @VarDecimalSupported = 1;

IF (@VarDecimalSupported > 0)
    BEGIN
        EXECUTE sp_db_vardecimal_storage_format N'Expenses', 'ON';
    END


GO



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
    GO

CREATE SECURITY POLICY ExpensesReportPolicy
ADD FILTER PREDICATE [Expense].fn_expensesReportsPredicate(EmployeeId) ON [Expense].[ExpenseReport]
GO

CREATE PROCEDURE [Expense].[SetContextInfo]
    @Email NVARCHAR(60)
AS
BEGIN
    DECLARE @encodedEmail VARBINARY(128)
    SET @encodedEmail = convert(VARBINARY(128), @Email)
    SET CONTEXT_INFO @encodedEmail
END
GO


 -- Temporal tables

 CREATE TABLE [Expense].[ExpenseTemporal](
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
	[SysStartTime] [datetime2] GENERATED ALWAYS AS ROW START NOT NULL,
	[SysEndTime] [datetime2] GENERATED ALWAYS AS ROW END NOT NULL,
	PERIOD FOR SYSTEM_TIME (SysStartTime,SysEndTime),
CONSTRAINT [PK_ExpenseTemporal.Expense] PRIMARY KEY CLUSTERED(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
)WITH(SYSTEM_VERSIONING = ON (HISTORY_TABLE = Expense.ExpenseHistory))

GO

ALTER TABLE [Expense].[ExpenseTemporal] ADD  DEFAULT ('1900-01-01T00:00:00.000') FOR [Date]
GO

ALTER TABLE [Expense].[ExpenseTemporal]  WITH CHECK ADD  CONSTRAINT [FK_Expense.ExpenseTemporal_Expense.ExpenseCategories_ExpenseCategoryId] FOREIGN KEY([ExpenseCategoryId])
REFERENCES [Expense].[ExpenseCategory] ([Id])
GO

ALTER TABLE [Expense].[ExpenseTemporal] CHECK CONSTRAINT [FK_Expense.ExpenseTemporal_Expense.ExpenseCategories_ExpenseCategoryId]
GO

ALTER TABLE [Expense].[ExpenseTemporal]  WITH CHECK ADD  CONSTRAINT [FK_Expense.ExpenseTemporal_Expense.ExpenseReport_ExpenseReportId] FOREIGN KEY([ExpenseReportId])
REFERENCES [Expense].[ExpenseReport] ([Id])
GO

ALTER TABLE [Expense].[ExpenseTemporal] CHECK CONSTRAINT [FK_Expense.ExpenseTemporal_Expense.ExpenseReport_ExpenseReportId]
GO

SET IDENTITY_INSERT [Expense].[ExpenseTemporal] ON
GO
-- Copy all the Expense table contents to the ExpenseTemporal table
INSERT INTO [Expense].[ExpenseTemporal](Id, EnabledFrom, EnabledTo, Title, Notes, Amount, ExpenseReportId, ExpenseCategoryId, ReceiptPicture, Date)
SELECT 
	Id, 
	EnabledFrom, 
	EnabledTo, 
	Title, 
	Notes, 
	Amount, 
	ExpenseReportId, 
	ExpenseCategoryId, 
	ReceiptPicture, 
	Date
FROM [Expense].[Expense]

SET IDENTITY_INSERT [Expense].[ExpenseTemporal] OFF
GO

-- Drop the Expense table
ALTER TABLE [Expense].[ExpenseBonus] DROP CONSTRAINT [FK_Expenses.ExpenseBonus_Expenses.Expenses_ExpenseId]
GO
ALTER TABLE [Expense].[SuspiciousExpense] DROP CONSTRAINT [FK_SuspiciousExpense_Expense]
GO
DROP TABLE [Expense].[Expense]

-- Change temporal table name to Expense
EXEC sp_rename 'Expense.ExpenseTemporal', 'Expense'

-- Add foreign keys to the new Expense table
ALTER TABLE [Expense].[ExpenseBonus]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.ExpenseBonus_Expenses.Expenses_ExpenseId] FOREIGN KEY([ExpenseId])
REFERENCES [Expense].[Expense] ([Id])
GO

ALTER TABLE [Expense].[ExpenseBonus] CHECK CONSTRAINT [FK_Expenses.ExpenseBonus_Expenses.Expenses_ExpenseId]
GO

ALTER TABLE [Expense].[SuspiciousExpense]  WITH CHECK ADD  CONSTRAINT [FK_Expenses.SuspiciousExpense_Expense] FOREIGN KEY([SuspiciousExpenseId])
REFERENCES [Expense].[Expense] ([Id])
GO

ALTER TABLE [Expense].[SuspiciousExpense] CHECK CONSTRAINT [FK_Expenses.SuspiciousExpense_Expense]
GO