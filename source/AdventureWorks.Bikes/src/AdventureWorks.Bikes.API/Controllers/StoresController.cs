using AdventureWorks.Bikes.API.ViewModels;
using AdventureWorks.Bikes.Infrastructure.CosmosDB.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AdventureWorks.Bikes.API.Controllers
{
    [Route("api/[controller]")]
    public class StoresController : Controller
    {
        //private readonly SqlStoresRepository _SqlStoresRepository = null;
        private readonly DBStoresRepository _CosmosDBStoresRepository = null;

        public StoresController(DBStoresRepository cosmosDBStoresRepository)
        {
            //_SqlStoresRepository = storesRepository;
            _CosmosDBStoresRepository = cosmosDBStoresRepository;
        }

        [HttpGet("{id:minlength(1)}")]
        public async Task<StoreDetailViewModel> GetAsync(string id)
        {
            var store = await _CosmosDBStoresRepository.GetAsync(id);
            return new StoreDetailViewModel(store);
        }

        [HttpGet("all")]
        public async Task<IEnumerable<StoreDetailViewModel>> GetAllAsync(int count = 10)
        {
            var stores = await _CosmosDBStoresRepository.GetAllAsync(count);
            return stores.Select(s => new StoreDetailViewModel(s));
        }

        [HttpGet]
        [Route("newstores")]
        public async Task<IEnumerable<StoreListViewModel>> GetNewStoresByAsync(int count = 5)
        {
            var stores = await _CosmosDBStoresRepository.GetNewStoresByAsync(count);
            return stores.Select(s => new StoreListViewModel(s));
        }

        [HttpGet]
        [Route("nearby")]
        public async Task<IEnumerable<StoreDetailViewModel>> GetNearByAsync(double latitude = 0, double longitude = 0, int count = 10)
        {
            var distances = await _CosmosDBStoresRepository.GetStoreDistanceAsync(latitude, longitude);
            if (distances != null && distances.Any())
            {
                var stores = await _CosmosDBStoresRepository
                    .GetByIdsAsync(distances.Take(count).OrderBy(d => d.Distance).Select(d => d.Id).ToList());

                return stores.Select(s =>
                        new StoreDetailViewModel(s, distances.First(d => d.Id == s.Id).Distance)
                    );
            }

            return null;
        }

        [HttpGet]
        [Route("picture/{storeId:minlength(1)}")]
        [ResponseCache(Duration = 180)]
        public async Task<IActionResult> GetPictureAsync(string storeId, int position = 1)
        {
            var image = await _CosmosDBStoresRepository.GetStorePictureAsync(storeId, position);
            if (image == null)
            {
                return BadRequest();
            }
            return new FileStreamResult(new MemoryStream(image), "image/jpeg");
        }

    }
}
