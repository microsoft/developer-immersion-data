using ContosoAir.Clients.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Deals
{
    public interface IDealsService
    {
        Task<IEnumerable<Deal>> GetDealsAsync();
    }
}