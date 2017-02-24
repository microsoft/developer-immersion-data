
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