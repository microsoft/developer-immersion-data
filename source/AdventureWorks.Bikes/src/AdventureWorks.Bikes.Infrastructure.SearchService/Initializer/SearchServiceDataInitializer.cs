using Microsoft.Extensions.Configuration;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace AdventureWorks.Bikes.Infrastructure.SearchService.Initializer
{
    public class SearchServiceDataInitializer
    {
        private readonly string _serviceName = string.Empty;
        private readonly string _apiKey = string.Empty;
        private string _indexer = string.Empty;

        public SearchServiceDataInitializer(IConfigurationRoot configuration)
        {
            _serviceName = configuration["SearchConfig:ServiceName"];
            _apiKey = configuration["SearchConfig:ApiKey"];
            _indexer = configuration["SearchConfig:Indexer"];
        }

        public async Task Initialize()
        {
            await Initialize(_indexer);
        }

        public async Task Initialize(string indexer)
        {
            _indexer = indexer;

            if (!await ExistsIndex())
            {
                await CreateIndex();
                await ImportData();
            }
        }


        async Task<bool> ExistsIndex()
        {
            string uri = $"https://{_serviceName}.search.windows.net/indexes/{_indexer }?api-version=2015-02-28";
            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);
                var response = await _httpClient.GetAsync(uri);
                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                    return true;
            }

            return false;
        }

        async Task CreateIndex()
        {
            string uri = $"https://{_serviceName}.search.windows.net/indexes?api-version=2015-02-28";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

                string file = File.ReadAllText("sampledata/searchservice/index.json");
                file = file.Replace("products", _indexer);
                var response = await _httpClient.PostAsync(uri, new StringContent(file, Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
            }
        }

        async Task ImportData()
        {
            string uri = $"https://{_serviceName}.search.windows.net/indexes/{_indexer }/docs/index?api-version=2015-02-28";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

                string file = File.ReadAllText("sampledata/searchservice/data.json");
                var response = await _httpClient.PostAsync(uri, new StringContent(file, Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
            }
        }

        async Task CreateSynonymMap()
        {
            string name = "bikesmap";
            string uri = $"https://{_serviceName}.search.windows.net/synonymmaps/{name}?api-version=2015-02-28-Preview";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

                string file = File.ReadAllText("sampledata/searchservice/synonymmap.json");
                //  If the synonym map does not exist, it will be created. 
                var response = await _httpClient.PutAsync(uri, new StringContent(file, Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
            }
        }
    }
}
