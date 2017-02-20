
using AdventureWorks.Bikes.Infrastructure.SearchService.Model;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;
using System;

namespace AdventureWorks.Bikes.Infrastructure.SearchService.Services
{
    public class SearchServiceProductsRepository
    {
        private readonly string _serviceName = string.Empty;
        private readonly string _apiKey = string.Empty;
        private readonly string _indexer = string.Empty;
        private readonly string _suggesterName = string.Empty;

        public SearchServiceProductsRepository(IConfigurationRoot configuration)
        {
            _serviceName = configuration["SearchConfig:ServiceName"];
            _apiKey = configuration["SearchConfig:ApiKey"];
            _indexer = configuration["SearchConfig:Indexer"];
            _suggesterName = configuration["SearchConfig:Suggester"];
        }

        public async Task<List<string>> GetAsync(string searchtext, int count)
        {
            string uri = $"https://{_serviceName}.search.windows.net/indexes/{_indexer}/docs?api-version=2015-02-28&$top={count}&$orderby=id" +
                $"&search={searchtext}";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

                var response = await _httpClient.GetAsync(uri);
                var jsonString = await response.Content.ReadAsStringAsync();
                var products = JsonConvert.DeserializeObject<RootObject>(jsonString);
                if (products != null && products.value != null)
                    return products.value.Select(p => p.id).ToList();
            }

            return null;
        }

        public async Task<List<string>> GetRecommendationsAsync(string searchtext, int count)
        {
            // REPLACE THIS COMMENT AND THE NEXT LINE WITH THE COPIED CODE.
            return await Task.FromResult<List<string>>(new List<string>());
        }

        public async Task<List<ProductHighlight>> GetHighlightedAsync(string searchtext, int count)
        {
            // REPLACE THIS COMMENT AND THE NEXT LINE WITH THE COPIED CODE.
            return await Task.FromResult<List<ProductHighlight>>(new List<ProductHighlight>());
        }

        public async Task<FacetsRootObject> GetFacetsByPrice(string searchtext, int interval)
        {
            // REPLACE THIS COMMENT AND THE NEXT LINE WITH THE COPIED CODE.
            return await Task.FromResult<FacetsRootObject>(new FacetsRootObject());
        }

    }

    class RootObject
    {
        public string odatacontext { get; set; }
        public Product[] value { get; set; }
    }

    class SuggestionsRootObject
    {
        public string odatacontext { get; set; }
        public Suggestion[] value { get; set; }
    }

    class Suggestion
    {
        public string searchtext { get; set; }
        public string id { get; set; }
    }


    public class FacetsRootObject
    {
        public string odatacontext { get; set; }
        [JsonProperty(PropertyName = "@search.facets")]
        public SearchFacets searchfacets { get; set; }
        public Product[] value { get; set; }
        public string odatanextLink { get; set; }
    }

    public class SearchFacets
    {
        public string OriginalPriceodatatype { get; set; }
        public Originalprice[] OriginalPrice { get; set; }
    }

    public class Originalprice
    {
        public int count { get; set; }
        public int value { get; set; }
    }


    public class RootHighightObject
    {
        public ProductHighlight[] value { get; set; }
    }

    public class ProductHighlight
    {
        [JsonProperty(PropertyName = "@search.highlights")]
        public SearchHighlights searchhighlights { get; set; }
        public string id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string StoreId { get; set; }
        public int OriginalPrice { get; set; }
    }

    public class SearchHighlights
    {
        public string[] Description { get; set; }
    }



}
