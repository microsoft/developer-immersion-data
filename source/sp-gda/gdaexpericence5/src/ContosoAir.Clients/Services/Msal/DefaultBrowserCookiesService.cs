using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Msal
{
    public class DefaultBrowserCookiesService : IBrowserCookiesService
    {
        public Task ClearCookiesAsync()
        {
            return Task.FromResult(true);
        }
    }
}
