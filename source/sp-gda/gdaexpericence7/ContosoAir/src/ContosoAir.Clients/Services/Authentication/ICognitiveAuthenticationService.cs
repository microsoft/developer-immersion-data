using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Authentication
{
    public interface ICognitiveAuthenticationService
    {
        Task InitializeAsync(string apiKey);
        string GetAccessToken();
    }
}