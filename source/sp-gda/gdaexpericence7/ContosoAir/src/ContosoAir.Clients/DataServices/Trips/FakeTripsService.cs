using ContosoAir.Clients.DataServices.Deals;
using ContosoAir.Clients.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Trips
{
    public class FakeTripsService : ITripsService
    {
        private static FlightStatus CurrentStatus = FlightStatus.CheckInAvailable;

        private readonly IDealsService _dealsService;

        public FakeTripsService(IDealsService dealsService)
        {
            _dealsService = dealsService;
        }

        public async Task<IEnumerable<Deal>> GetTripsAsync()
        {
            var deals = await _dealsService.GetDealsAsync();

            var trips = deals.Where(t => 
                t.ToName.Equals("Barcelona",
                StringComparison.CurrentCultureIgnoreCase))
                .Take(1);

            /*
            var firstTrip = trips.FirstOrDefault();

            if(firstTrip != null)
            {
                firstTrip.FromName = "Barcelona";
                firstTrip.FromCode = "BCN";
                firstTrip.ToName = "Seattle";
                firstTrip.ToCode = "SEA";

                trips = new List<Deal>
                {
                    firstTrip
                };
            }
            */

            return trips;
        }

        public Task<FlightStatus> GetCurrentFlightStatusAsync()
        {
            return Task.FromResult(CurrentStatus);
        }

        public Task SetCurrentFlightStatusAsync(FlightStatus status)
        {
            CurrentStatus = status;
            return Task.FromResult(true);
        }
    }
}
