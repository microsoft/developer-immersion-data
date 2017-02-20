using AdventureWorks.Bikes.API.ViewModels;
using AdventureWorks.Bikes.Infrastructure.DocumentDB.Repositories;
using AdventureWorks.Bikes.Infrastructure.SearchService.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AdventureWorks.Bikes.API.Controllers
{
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly DBProductsRepository _DBProductsRepository = null;
        private readonly SearchServiceProductsRepository _ServiceServiceProductsService = null;
        private const int _recommendationsCount = 3;

        public ProductsController(DBProductsRepository documentDBProductsRepository,
            SearchServiceProductsRepository searchService)
        {
            _DBProductsRepository = documentDBProductsRepository;
            _ServiceServiceProductsService = searchService;
        }

        [HttpGet()]
        [Route("{id:minlength(1)}", Order = 1)]
        public async Task<ProductDetailViewModel> GetAsync(string id)
        {
            var product = await _DBProductsRepository.GetAsync(id);
            return new ProductDetailViewModel(product);
        }

        [HttpGet]
        [Route("all/{searchtext}")]
        public async Task<IEnumerable<ProductListViewModel>> GetProductsAsync(string searchtext, int count = 10)
        {
            IEnumerable<ProductListViewModel> results = null;
            List<string> productIds = await _ServiceServiceProductsService.GetAsync(searchtext, count);
            if (productIds != null && productIds.Any())
            {
                var products = await _DBProductsRepository.GetByIdsAsync(productIds);
                results = products.Select(p => new ProductListViewModel(p));
            }

            return results;
        }

        [HttpGet]
        [Route("latest")]
        public async Task<IEnumerable<ProductListViewModel>> GetLatestProductsAsync()
        {
            int count = 2;
            IEnumerable<ProductListViewModel> results = null;
            // TODO: Add logic to return the latest products.
            List<string> productIds = await _ServiceServiceProductsService.GetAsync(string.Empty, count);
            if (productIds != null && productIds.Any())
            {
                var products = await _DBProductsRepository.GetByIdsAsync(productIds);
                results = products.Select(p => new ProductListViewModel(p));
            }

            return results;
        }

        [HttpGet]
        [Route("highlighted")]
        public async Task<IEnumerable<ProductListViewModel>> GetHighlightedProductsAsync()
        {
            int count = 2;
            IEnumerable<ProductListViewModel> results = null;

            // TODO: Add logic to return the desired products.
            List<string> productIds = await _ServiceServiceProductsService.GetAsync(string.Empty, count);
            if (productIds != null && productIds.Any())
            {
                var products = await _DBProductsRepository.GetByIdsAsync(productIds);
                results = products.Select(p => new ProductListViewModel(p));
            }

            return results;
        }


        [HttpGet]
        [Route("store/{storeId:minlength(1)}")]
        public async Task<IEnumerable<ProductListViewModel>> GetByStoreIdAsync(string storeId, int count = 10)
        {
            var products = await _DBProductsRepository.GetByStoreIdAsync(storeId, count);
            return products.Select(p => new ProductListViewModel(p));
        }

        [HttpGet]
        [Route("recommendations/{searchtext}")]
        public async Task<List<string>> GetRecommendationsAsync(string searchtext, int count = 5)
        {
            return await _ServiceServiceProductsService.GetRecommendationsAsync(searchtext, count);
        }

        [HttpGet]
        [Route("picture/{productId:minlength(1)}")]
        [ResponseCache(Duration = 180)]
        public async Task<IActionResult> GetPictureAsync(string productId)
        {
            var image = await _DBProductsRepository.GetPictureAsync(productId);
            if (image == null)
            {
                return BadRequest();
            }
            return new FileStreamResult(new MemoryStream(image), "image/jpeg");
        }

        [HttpGet]
        [Route("facets/{searchtext}")]
        public async Task<FacetsProductListViewModel> GetFacetedProductsAsync(string searchtext, int interval = 100)
        {
            FacetsProductListViewModel facetedProducts = new FacetsProductListViewModel();
            var originalPriceList =  await _ServiceServiceProductsService.GetFacetsByPrice(searchtext, interval);
            if(originalPriceList != null)
            {
                var productIds = originalPriceList.value.Select(p => p.id).ToList();
                var products = await _DBProductsRepository.GetByIdsAsync(productIds);
                facetedProducts.productList = products.Select(p => new ProductListViewModel(p));
                facetedProducts.priceFacetList = originalPriceList.searchfacets.OriginalPrice.Select(f => new PriceFacetViewModel(f));
            }

            return facetedProducts;            
        }


    }
}
