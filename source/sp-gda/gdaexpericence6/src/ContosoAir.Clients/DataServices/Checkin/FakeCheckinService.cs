using ContosoAir.Clients.Models;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Checkin
{
    public class FakeCheckinService : ICheckinService
    {
        private Flight MockFlight01 = new Flight
        {
            Id = 935,
            FromName = "Seattle",
            FromCode = "SEA",
            ToName = "Paris",
            ToCode = "CDG",
            DepartDate = DateTime.Today.ToString("dd MMM yy"),
            BoardingTime = "7:45 AM",
            DepartTime = "8:05 AM",
            Gate = "A8",
            Seat ="19F",
            Terminal = "C3"
        };

        private Flight MockFlight02 = new Flight
        {
            Id = 851,
            FromName = "Paris",
            FromCode = "CDG",
            ToName = "Barcelona",
            ToCode = "BCN",
            DepartDate = DateTime.Today.ToString("dd MMM yy"),
            BoardingTime = "2:40 PM",
            DepartTime = "3:00 PM",
            Gate = "M15",
            Seat = "25D",
            Terminal = "B4"
        };

        public async Task<ObservableCollection<Flight>> GetCheckInFlightsAsync()
        {
            await Task.Delay(500);

            var flights = new ObservableCollection<Flight>
            {
                MockFlight01,
                MockFlight02
            };

            return flights;
        }
    }
}