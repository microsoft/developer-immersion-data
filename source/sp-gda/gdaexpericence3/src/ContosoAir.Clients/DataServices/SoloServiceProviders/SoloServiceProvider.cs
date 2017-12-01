using ContosoAir.Clients.DataServices.Deals;
using ContosoAir.Clients.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using ContosoAir.Clients.Helpers;

namespace ContosoAir.Clients.DataServices.SoloServiceProviders
{
    class SoloServiceProvider : ISoloServiceProvider
    {
        private readonly JsonSerializerSettings _serializerSettings;

        // Read url string from  GlobalSetting
        public string GetSoloServiceInfoUrl;
        public string GetSoloServiceReviewUrl;


        public SoloServiceProvider()
        {
            GetSoloServiceInfoUrl = Settings.GetSoloServiceInfoUrl;
            GetSoloServiceReviewUrl = Settings.GetSoloServiceReviewUrl;

            _serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                NullValueHandling = NullValueHandling.Ignore
            };
        }


        private HttpClient CreateHttpClient()
        {
            var httpClient = new HttpClient();

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return httpClient;
        }

        private async Task HandleResponse(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                if (response.StatusCode == HttpStatusCode.Forbidden || response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    throw new Exception(content);
                }

                throw new HttpRequestException(content);
            }
        }

        // Get SoloService Providers Information from Cosmos DB

        public async Task<IEnumerable<SoloService>> GetSoloServiceProviderAsync()
        {
            HttpClient httpClient = CreateHttpClient();
            HttpResponseMessage response = await httpClient.GetAsync(GetSoloServiceInfoUrl);

            await HandleResponse(response);

            string responseData = await response.Content.ReadAsStringAsync();

            return await Task.Run(() => JsonConvert.DeserializeObject<IEnumerable<SoloService>>(responseData, _serializerSettings));
        }       
    }
}
