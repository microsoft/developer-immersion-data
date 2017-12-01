using Microsoft.Azure.Documents.Client;
using System;

namespace GraphExplorer.Configuration
{
    public static class DocDbSettings
    {
        private static DocDbConfig dbConfig = AppSettings.Instance.GetSection<DocDbConfig>("DocumentDBConfig");
        public static string DatabaseId = dbConfig.Database;
        public static DocumentClient Client;

        public static void Init()
        {
            Client = new DocumentClient(new Uri(dbConfig.Endpoint), dbConfig.AuthKey, new ConnectionPolicy { EnableEndpointDiscovery = false });
        }
    }
}
  

      
