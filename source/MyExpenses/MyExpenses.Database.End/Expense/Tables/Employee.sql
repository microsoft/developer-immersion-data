CREATE TABLE [Expense].[Employee] (
    [Id]                INT                                              IDENTITY (1, 1) NOT NULL,
    [FirstName]         NVARCHAR (50)                                    NOT NULL,
    [LastName]          NVARCHAR (50)                                    NOT NULL,
    [Email]             NVARCHAR (60) MASKED WITH (FUNCTION = 'email()') NOT NULL,
    [Identifier]        NVARCHAR (50)                                    NOT NULL,
    [JobTitle]          NVARCHAR (50)                                    NOT NULL,
    [TeamId]            INT                                              NOT NULL,
    [IsTeamManager]     BIT                                              NOT NULL,
    [BankAccountNumber] NVARCHAR (17)                                    COLLATE Latin1_General_BIN2  ENCRYPTED WITH (
     COLUMN_ENCRYPTION_KEY = [alwaysEncryptedColumnEncryptionKey],
     ALGORITHM = N'AEAD_AES_256_CBC_HMAC_SHA_256',
     ENCRYPTION_TYPE = DETERMINISTIC
    ) NOT NULL,
    CONSTRAINT [PK_Expenses.Employees] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Expenses.Employees_Expenses.Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Expense].[Team] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_TeamId]
    ON [Expense].[Employee]([TeamId] ASC);

