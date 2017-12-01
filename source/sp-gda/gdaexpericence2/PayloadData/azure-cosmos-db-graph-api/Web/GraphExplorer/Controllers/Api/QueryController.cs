namespace GraphExplorer.Controllers
{
    using GraphExplorer.Models;
    using GraphExplorer.Utilities;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class QueryController : ApiController
    {
        private FileSystemRepository<List<GraphQuery>> queryRepo = new FileSystemRepository<List<GraphQuery>>("queries.json");
        
        public async Task<IEnumerable<GraphQuery>> Get(string collectionId)
        {
            return await queryRepo.GetItemAsync(collectionId);
        }

        public async Task Post([FromBody]GraphQuery value, [FromUri]string collectionId)
        {
            if (string.IsNullOrEmpty(value.Id))
            {
                value.Id = Guid.NewGuid().ToString();
            }

            var queries = await queryRepo.GetItemAsync(collectionId);

            if(queries == null)
            {
                queries = new List<GraphQuery>();
            }

            queries.Add(value);

            await queryRepo.CreateOrUpdateItemAsync(queries, collectionId);
        }

        public async Task Delete(string id, string collectionId)
        {
            var queries = await queryRepo.GetItemAsync(collectionId);
            var existing = queries.Find(q => q.Id == id);

            if (existing != null)
            {
                queries.Remove(existing);
            }

            await queryRepo.CreateOrUpdateItemAsync(queries, collectionId);
        }
    }
}