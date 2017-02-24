CREATE PROCEDURE [Audit].usp_Audit 
	@Email [nvarchar](60),
	@Path [nvarchar](255), 
	@RequestContent [nvarchar](max),
	@Verb [varchar](10),
	@ResponseCode [nvarchar](3),
	@ResponseContent [nvarchar](max)  
 AS   
	  INSERT INTO [Audit].[WebAudit]([Email], [Path], [RequestContent], [Verb], [ResponseCode], [ResponseContent], [Date])
	  VALUES (@Email, @Path, @RequestContent, @Verb, @ResponseCode, @ResponseContent, GETDATE()) 
GO