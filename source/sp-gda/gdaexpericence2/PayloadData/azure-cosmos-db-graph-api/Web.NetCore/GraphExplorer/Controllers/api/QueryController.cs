namespace GraphExplorer.Controllers
{
    using GraphExplorer.Models;
    using GraphExplorer.Utilities;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Hosting;
    using System.IO;

    [Route("api/[controller]")]
    public class QueryController : Controller
    {
        private FileSystemRepository<List<GraphQuery>> queryRepo;

        public QueryController(IHostingEnvironment env)
        {
            queryRepo = new FileSystemRepository<List<GraphQuery>>(env, "queries.json");
        }


        [HttpGet]
        public async Task<IEnumerable<GraphQuery>> Get(string collectionId)
        {
            return await queryRepo.GetItemAsync(collectionId);
        }

        [HttpPost]
        public async Task Post([FromBody]GraphQuery value, [FromQuery]string collectionId)
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

        [HttpDelete]
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