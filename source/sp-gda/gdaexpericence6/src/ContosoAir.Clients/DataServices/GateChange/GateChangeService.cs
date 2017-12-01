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

namespace ContosoAir.Clients.DataServices.GateChange
{
    class GateChangeService : IGateChangeService
    {
        private readonly JsonSerializerSettings _serializerSettings;        
        public string FlightDelayInfoUrl = "";

        public GateChangeService()
        {
            FlightDelayInfoUrl = Settings.FlightDelayInfoUrl;           

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
    }
}
