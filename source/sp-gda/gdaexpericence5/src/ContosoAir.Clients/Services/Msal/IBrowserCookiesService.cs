using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Msal
{
    public interface IBrowserCookiesService
    {
        Task ClearCookiesAsync();
    }
}
