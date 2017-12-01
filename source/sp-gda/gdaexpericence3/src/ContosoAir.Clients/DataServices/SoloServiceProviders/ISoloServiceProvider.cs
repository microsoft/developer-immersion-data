using ContosoAir.Clients.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.SoloServiceProviders
{
    public interface ISoloServiceProvider
    {
        Task<IEnumerable<SoloService>> GetSoloServiceProviderAsync();        
    }
}
