using ContosoAir.Clients.Models;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Authentication
{
    public interface IAuthenticationService
    {
        bool IsAuthenticated { get; }

        Task<bool> LoginAsync(string email, string password);

        Task<bool> LoginWithMicrosoftAsync();

        Task<Profile> GetProfileAsync();

        Task LogoutAsync();
    }
}