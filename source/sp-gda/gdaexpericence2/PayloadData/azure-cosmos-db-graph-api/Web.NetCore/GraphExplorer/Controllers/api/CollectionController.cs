namespace GraphExplorer.Controllers.Api
{
    using GraphExplorer.Configuration;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Options;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    public class CollectionController : Controller
    {  
        private readonly DocDbConfig dbConfig;
        private readonly DocumentClient client; 

        public CollectionController(IOptions<DocDbConfig> configSettings)
        {
            dbConfig = configSettings.Value;            
            client = new DocumentClient(new Uri(dbConfig.Endpoint), dbConfig.AuthKey, new ConnectionPolicy { EnableEndpointDiscovery = false });
        }

        [HttpGet]
        public dynamic GetCollections()
        {
            Database database = client.CreateDatabaseQuery("SELECT * FROM d WHERE d.id = \"" + dbConfig.Database + "\"").AsEnumerable().FirstOrDefault();
            List<string> collections = client.CreateDocumentCollectionQuery((String)database.SelfLink).Select(s => s.Id).ToList();
            return collections;
        }

        [HttpPost]
        public async Task CreateCollection([FromQuery]string name)
        {
            await CreateCollectionIfNotExistsAsync(name);
        }

        [HttpDelete]
        public async Task DeleteCollection(string name)
        {
            await DeleteCollectionAsync(name);
        }

        private async Task CreateCollectionIfNotExistsAsync(string collectionId)
        {
            try
            {
                await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(dbConfig.Database, collectionId));
            }
            catch (DocumentClientException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    await client.CreateDocumentCollectionAsync(
                        UriFactory.CreateDatabaseUri(dbConfig.Database),
                        new DocumentCollection { Id = collectionId },
                        new RequestOptions { OfferThroughput = 400 });
                }
                else
                {
                    throw;
                }
            }
        }

        private async Task DeleteCollectionAsync(string collectionId)
        {
            await client.DeleteDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(dbConfig.Database, collectionId));
        }
    }
}
