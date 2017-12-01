using ContosoAir.Clients.Models;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Checkin
{
    public interface ICheckinService
    {
        Task<ObservableCollection<Flight>> GetCheckInFlightsAsync();
    }
}
