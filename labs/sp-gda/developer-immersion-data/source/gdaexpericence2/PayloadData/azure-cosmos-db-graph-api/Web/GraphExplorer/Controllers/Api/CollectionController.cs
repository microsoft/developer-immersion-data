namespace GraphExplorer.Controllers.Api
{
    using GraphExplorer.Configuration;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class CollectionController : ApiController
    {
        [HttpGet]
        public dynamic GetCollections()
        {
            DocumentClient client = DocDbSettings.Client;
            Database database = client.CreateDatabaseQuery("SELECT * FROM d WHERE d.id = \"" + DocDbSettings.DatabaseId + "\"").AsEnumerable().FirstOrDefault();
            List<string> collections = client.CreateDocumentCollectionQuery((String)database.SelfLink).Select(s => s.Id).ToList();
            return collections;
        }

        [HttpPost]
        public async Task CreateCollection([FromUri]string name)
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
                await DocDbSettings.Client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(DocDbSettings.DatabaseId, collectionId));
            }
            catch (DocumentClientException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    await DocDbSettings.Client.CreateDocumentCollectionAsync(
                        UriFactory.CreateDatabaseUri(DocDbSettings.DatabaseId),
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
            await DocDbSettings.Client.DeleteDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(DocDbSettings.DatabaseId, collectionId));
        }
    }
}
