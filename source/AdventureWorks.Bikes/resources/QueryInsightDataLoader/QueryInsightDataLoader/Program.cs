using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace QueryInsightDataLoader
{
    class Program
    {
        static string Server = string.Empty;
        static string UserName = string.Empty;
        static string Password = string.Empty;
        static string Acess_Token = string.Empty;
        static int SleepTimeout = 0;

        static void Main(string[] args)
        {
            Server = ConfigurationManager.AppSettings["Server"];
            UserName = ConfigurationManager.AppSettings["UserName"];
            Password = ConfigurationManager.AppSettings["Password"];
            Int32.TryParse(ConfigurationManager.AppSettings["SleepTimeout"], out SleepTimeout);

            MainAsync().Wait();
            
        }


        static async Task MainAsync()
        {
            Acess_Token = await GetAuthToken();

            while (true)
            {
                Console.WriteLine("Getting customers...");
                await Get("customers/all");

                Console.WriteLine("Getting orders...");
                await Get("orders/all");

                Thread.Sleep(SleepTimeout);
            }

        }


        async static Task<string> GetAuthToken()
        {
            string uri = $"{Server}/connect/token";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

                var body = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("grant_type", "password"),
                    new KeyValuePair<string, string>("username", UserName),
                    new KeyValuePair<string, string>("password", Password),
                    new KeyValuePair<string, string>("client_id", "Bikes"),
                    new KeyValuePair<string, string>("client_secret", "secret"),
                    new KeyValuePair<string, string>("scope", "api")
                };

                var response = await _httpClient.PostAsync(uri, new FormUrlEncodedContent(body));
                response.EnsureSuccessStatusCode();
                var token = JsonConvert.DeserializeObject<Token>(await response.Content.ReadAsStringAsync());
                return token.access_token;
            }
        }

        async static Task Get(string method)
        {
            string uri = $"{Server}/api/{method}";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"bearer {Acess_Token}");

                var response = await _httpClient.GetAsync(uri);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
            }
        }
    }
}
