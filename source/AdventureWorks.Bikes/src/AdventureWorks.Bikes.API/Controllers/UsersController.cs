using AdventureWorks.Bikes.API.ViewModels;
using AdventureWorks.Bikes.Infrastructure.CosmosDB.Repositories;
using AdventureWorks.Bikes.Infrastructure.Sql.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace AdventureWorks.Bikes.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly SqlUsersRepository _SqlUsersRepository;
        private readonly DBStoresRepository _CosmosDBStoresRepository = null;
        private readonly IConfigurationRoot _Configuration = null;
        private readonly string _DefaultStore = "1";

        public UsersController(SqlUsersRepository sqlUsersRepository,
            DBStoresRepository cosmosDBStoresRepository, IConfigurationRoot configuration)
        {
            _SqlUsersRepository = sqlUsersRepository;
            _CosmosDBStoresRepository = cosmosDBStoresRepository;
            _Configuration = configuration;
        }

        [HttpGet("user")]
        public async Task<ApplicationUserViewModel> GetUserAsync()
        {
            var user = await _SqlUsersRepository.GetUserAsync(GetUser());
            return new ApplicationUserViewModel(user);
        }

        [HttpGet("user/store")]
        public async Task<StoreDetailViewModel> GetStoreAsync()
        {
            // TODO: get the storeId for the logged user.
            var store = await _CosmosDBStoresRepository.GetAsync(_DefaultStore);
            return new StoreDetailViewModel(store);
        }

        string GetUser()
        {
            if (User.Identity.IsAuthenticated)
                return User.FindFirst("username").Value;
            else
                // Used in demos to allow not authenticated scenarios.
                return _Configuration["DefaultUsername"];
        }
    }
}
