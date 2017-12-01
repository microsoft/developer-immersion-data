using Microsoft.Identity.Client;

namespace ContosoAir.Clients.Services.Msal
{
    public interface IPlatformParameterProvider
    {
        IPlatformParameters GetPlatformParameters();
    }
}
