namespace GraphExplorer.Controllers
{
    using GraphExplorer.Models;
    using System.Threading.Tasks;
    using Utilities;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Hosting;

    [Route("api/[controller]")]    
    public class SettingsController : Controller
    {
        private const string id = "__settings";

        private FileSystemRepository<GraphSettings> settingsRepo;

        public SettingsController(IHostingEnvironment env)
        {
            settingsRepo = new FileSystemRepository<GraphSettings>(env, "graphsettings.json");
        }

        [HttpGet]
        public async Task<GraphSettings> Get(string collectionId)
        {
            return await settingsRepo.GetItemAsync(collectionId);
        }

        [HttpPost]
        public async Task Post([FromBody]GraphSettings value, [FromQuery]string collectionId)
        {        
            await settingsRepo.CreateOrUpdateItemAsync(value, collectionId);
        }

        [HttpDelete]
        public async Task Delete(string collectionId)
        {
            await settingsRepo.DeleteItemAsync(id, collectionId);
        }
    }
}