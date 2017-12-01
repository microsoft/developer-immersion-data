using ContosoAir.Clients.Models;
//using ContosoAir.Clients.DataServices.Feedback;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Xamarin.Forms;

namespace ContosoAir.Clients.DataServices.Feedback
{
    public class FeedbackPost : IFeedbackPost
    {
        private readonly JsonSerializerSettings _serializerSettings;

        public FeedbackPost()
        {
            _serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                NullValueHandling = NullValueHandling.Ignore
            };
        }

        public HttpClient CreateHttpClient()
        {
            var httpClient = new HttpClient();

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return httpClient;
        }

        public async Task HandleResponse(HttpResponseMessage response)
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


        public async Task<FlightFeedbackData> PutAsync<FlightFeedbackData>(string uri, FlightFeedbackData ffd)
        {
            HttpClient httpClient = CreateHttpClient();
            string serialized = await Task.Run(() => JsonConvert.SerializeObject(ffd, _serializerSettings));
            HttpResponseMessage response = await httpClient.PutAsync(uri, new StringContent(serialized, Encoding.UTF8, "text/plain"));

            await HandleResponse(response);

            string responseData = await response.Content.ReadAsStringAsync();

            return await Task.Run(() => JsonConvert.DeserializeObject<FlightFeedbackData>(responseData, _serializerSettings));
        }




        public async Task<IEnumerable<FlightData>> GetFlight()
        {
            HttpClient httpClient = CreateHttpClient();
            HttpResponseMessage responses = await httpClient.GetAsync("https://c2crohitlab5poc.azurewebsites.net/api/AzureFunctionForSelectFlightID?code=X2JH6/Xee6IXigA5/CEDi18t5PCykmB0f0n1/DzBj3qnbTCtkSdIeA==");

            await HandleResponse(responses);

            string responseData = await responses.Content.ReadAsStringAsync();

            return await Task.Run(() => JsonConvert.DeserializeObject<IEnumerable<FlightData>>(responseData, _serializerSettings));


        }
    }
}

