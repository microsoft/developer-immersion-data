using ContosoAir.Clients.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Trips
{
    public interface ITripsService
    {
        Task<IEnumerable<Deal>> GetTripsAsync();

        Task<FlightStatus> GetCurrentFlightStatusAsync();

        Task SetCurrentFlightStatusAsync(FlightStatus status);
    }
}