using Microsoft.Identity.Client;

namespace ContosoAir.Clients.Services.Msal
{
    public class DefaultPlatformParameterProvider : IPlatformParameterProvider
    {
        public IPlatformParameters GetPlatformParameters()
        {
            return default(IPlatformParameters);
        }
    }
}
