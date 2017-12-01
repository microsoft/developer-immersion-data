using ContosoAir.Clients.Helpers;
using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Authentication
{
    public class CognitiveAuthenticationService : ICognitiveAuthenticationService
    {
        private string subscriptionKey;
        private string token;
        private Timer accessTokenRenewer;
        private const int RefreshTokenDuration = 9;

        public async Task InitializeAsync(string apiKey)
        {
            subscriptionKey = apiKey;
            token = await FetchTokenAsync(GlobalSettings.AuthenticationTokenEndpoint, subscriptionKey);
            accessTokenRenewer = new Timer(new TimerCallback(OnTokenExpiredCallback), this, TimeSpan.FromMinutes(RefreshTokenDuration), TimeSpan.FromMilliseconds(-1));
        }

        public string GetAccessToken()
        {
            return token;
        }

        async Task RenewAccessToken()
        {
            token = await FetchTokenAsync(GlobalSettings.AuthenticationTokenEndpoint, subscriptionKey);
            Debug.WriteLine("Renewed token.");
        }

        async Task OnTokenExpiredCallback(object stateInfo)
        {
            try
            {
                await RenewAccessToken();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(string.Format("Failed to renew access token. Details: {0}", ex.Message));
            }
            finally
            {
                try
                {
                    accessTokenRenewer.Change(TimeSpan.FromMinutes(RefreshTokenDuration), TimeSpan.FromMilliseconds(-1));
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(string.Format("Failed to reschedule the timer to renew access token. Details: {0}", ex.Message));
                }
            }
        }

        async Task<string> FetchTokenAsync(string fetchUri, string apiKey)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);
                UriBuilder uriBuilder = new UriBuilder(fetchUri);
                uriBuilder.Path += "/issueToken";

                var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null);
                return await result.Content.ReadAsStringAsync();
            }
        }
    }
}
