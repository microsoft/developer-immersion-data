using Microsoft.Azure.Management.DataLake.Analytics;

using Microsoft.Azure.Management.DataLake.Analytics.Models;

using Microsoft.Azure.Management.DataLake.Store;

using Microsoft.Azure.Management.DataLake.Store.Models;
using Microsoft.Azure.Management.DataLake.StoreUploader;

using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;

using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;

using System.IO;



namespace AdventureWorks.SdkSample
{
    class Program
    {
        private static DataLakeAnalyticsAccountManagementClient _adlaClient;
        private static DataLakeAnalyticsJobManagementClient _adlaJobClient;
        private static DataLakeAnalyticsCatalogManagementClient _adlaCatalogClient;
        private static DataLakeStoreAccountManagementClient _adlsClient;
        private static DataLakeStoreFileSystemManagementClient _adlsFileSystemClient;

        private static string _adlaAccountName;
        private static string _adlsAccountName;
        private static string _resourceGroupName;
        private static string _location;
        private static string _tenantId;
        private static string _subId;
        private static string _clientId;
        private static string _clientKey;

        private static void Main(string[] args)
        {
            _adlsAccountName = "<DATA-LAKE-STORE-NAME>"; // TODO: Replace this value with the name for a NEW Store account.
            _adlaAccountName = "<DATA-LAKE-ANALYTICS-NAME>"; // TODO: Replace this value with the name for a NEW Analytics account.
            _resourceGroupName = "<RESOURCE-GROUP>"; // TODO: Replace this value. This resource group should already exist.
            _location = "East US 2";
            _tenantId = "<TENANT-ID>";
            _subId = "<SUBSCRIPTION-ID>";
            _clientId = "<CLIENT-ID>";
            _clientKey = "<CLIENT-KEY>";

            string localFolderPath = @"c:\temp\"; // TODO: Make sure this exists and contains SampleUSQLScript.txt.
            var tokenCreds = Authenticate(_tenantId, _clientId, _clientKey);

            SetupClients(tokenCreds, _subId);

            // Run sample scenarios
            WaitForNewline("Authenticated.", "Creating NEW accounts.");
            CreateAccounts();
            WaitForNewline("Accounts created.", "Preparing the source data file.");

            // Transfer the source file from a public Azure Blob container to Data Lake Store.
            CloudBlockBlob blob = new CloudBlockBlob(new Uri("https://adltutorials.blob.core.windows.net/adls-sample-data/SearchLog.tsv"));
            blob.DownloadToFile(localFolderPath + "SearchLog.tsv", FileMode.Create); // from WASB
            UploadFile(localFolderPath + "SampleSearchData.tsv", "/Samples/Data/SampleSearchData.tsv"); // to ADLS
            WaitForNewline("Source data file prepared.", "Submitting a job.");

            // Submit the job
            Guid jobId = SubmitJobByPath(localFolderPath + "SampleUSQLScript.txt", "My First ADLA Job");
            WaitForNewline("Job submitted.", "Waiting for job completion.");

            // Wait for job completion
            WaitForJob(jobId);
            WaitForNewline("Job completed.", "Downloading job output.");

            // Download job output
            DownloadFile(@"/Output/MostSearchedBike.csv", localFolderPath + "MostSearchedBike.csv");
            WaitForNewline("Job output downloaded.", "Deleting accounts.");

            // Delete accounts
            _adlaClient.Account.Delete(_resourceGroupName, _adlaAccountName);
            _adlsClient.Account.Delete(_resourceGroupName, _adlsAccountName);

            WaitForNewline("Accounts deleted. You can now exit.");
        }

        // Helper function to show status and wait for user input
        public static void WaitForNewline(string reason, string nextAction = "")
        {
            Console.WriteLine(reason + "\r\nPress ENTER to continue...");

            Console.ReadLine();

            if (!String.IsNullOrWhiteSpace(nextAction))
                Console.WriteLine(nextAction);
        }

        public static TokenCredentials Authenticate(string tenantId, string clientId, string clientKey)
        {
            var authContext = new AuthenticationContext("https://login.microsoftonline.com/" + _tenantId);
            var creds = new ClientCredential(_clientId, _clientKey);
            var tokenAuthResult = authContext.AcquireTokenAsync("https://management.core.windows.net/", creds).Result;

            return new TokenCredentials(tokenAuthResult.AccessToken);
        }

        public static void SetupClients(TokenCredentials tokenCreds, string subscriptionId)
        {
            _adlaClient = new DataLakeAnalyticsAccountManagementClient(tokenCreds);
            _adlaClient.SubscriptionId = subscriptionId;

            _adlaJobClient = new DataLakeAnalyticsJobManagementClient(tokenCreds);

            _adlaCatalogClient = new DataLakeAnalyticsCatalogManagementClient(tokenCreds);

            _adlsClient = new DataLakeStoreAccountManagementClient(tokenCreds);
            _adlsClient.SubscriptionId = subscriptionId;

            _adlsFileSystemClient = new DataLakeStoreFileSystemManagementClient(tokenCreds);
        }

        public static void CreateAccounts()
        {
            //ADLS account first, ADLA requires an ADLS account
            var adlsParameters = new DataLakeStoreAccount(location: _location);
            _adlsClient.Account.Create(_resourceGroupName, _adlsAccountName, adlsParameters);

            var defaultAdlsAccount = new List<DataLakeStoreAccountInfo> { new DataLakeStoreAccountInfo(_adlsAccountName, new DataLakeStoreAccountInfoProperties()) };
            var adlaProperties = new DataLakeAnalyticsAccountProperties(defaultDataLakeStoreAccount: _adlsAccountName, dataLakeStoreAccounts: defaultAdlsAccount);
            var adlaParameters = new DataLakeAnalyticsAccount(properties: adlaProperties, location: _location);
            _adlaClient.Account.Create(_resourceGroupName, _adlaAccountName, adlaParameters);
        }

        public static Guid SubmitJobByPath(string scriptPath, string jobName)
        {
            var script = File.ReadAllText(scriptPath);

            var jobId = Guid.NewGuid();
            var properties = new USqlJobProperties(script);
            var parameters = new JobInformation(jobName, JobType.USql, properties, priority: 1, degreeOfParallelism: 1, jobId: jobId);
            var jobInfo = _adlaJobClient.Job.Create(_adlaAccountName, jobId, parameters);

            return jobId;
        }

        public static JobResult WaitForJob(Guid jobId)
        {
            var jobInfo = _adlaJobClient.Job.Get(_adlaAccountName, jobId);
            while (jobInfo.State != JobState.Ended)
            {
                jobInfo = _adlaJobClient.Job.Get(_adlaAccountName, jobId);
            }
            return jobInfo.Result.Value;
        }

        public static void UploadFile(string srcFilePath, string destFilePath, bool force = true)
        {
            var parameters = new UploadParameters(srcFilePath, destFilePath, _adlsAccountName, isOverwrite: force);
            var frontend = new DataLakeStoreFrontEndAdapter(_adlsAccountName, _adlsFileSystemClient);
            var uploader = new DataLakeStoreUploader(parameters, frontend);
            uploader.Execute();
        }

        public static void DownloadFile(string srcPath, string destPath)
        {
            var stream = _adlsFileSystemClient.FileSystem.Open(_adlsAccountName, srcPath);
            var fileStream = new FileStream(destPath, FileMode.Create);

            stream.CopyTo(fileStream);
            fileStream.Close();
            stream.Close();
        }
    }
}