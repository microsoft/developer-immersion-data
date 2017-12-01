using ContosoAir.Clients.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Deals
{
    public class FakeDealsService : IDealsService
    {
        private static List<Deal> Deals = new List<Deal>
        {
            new Deal
            {
                Id = 1,
                DepartTime = new DateTime(TimeSpan.FromHours(8).Ticks).AddMinutes(45).ToString(),
                ArrivalTime = new DateTime(TimeSpan.FromHours(14).Ticks).AddMinutes(25).ToString(),
                FromCode = "JFK",
                FromName = "New York",
                ToCode = "BAR",
                ToName = "Barcelona",
                Hours = "11h 20m",
                Price = 750,
                Stops = 1  
            },
            new Deal
            {
                Id = 2,
                DepartTime = new DateTime(TimeSpan.FromHours(8).Ticks).AddMinutes(45).ToString(),
                ArrivalTime = new DateTime(TimeSpan.FromHours(19).Ticks).AddMinutes(25).ToString(),
                FromCode = "JFK",
                FromName = "New York",
                ToCode = "TOK",
                ToName = "Tokyo",
                Hours = "18h 30m",
                Price = 1050,
                Stops = 1
            },
            new Deal
            {
                Id = 3,
                DepartTime = new DateTime(TimeSpan.FromHours(8).Ticks).AddMinutes(45).ToString(),
                ArrivalTime = new DateTime(TimeSpan.FromHours(11).Ticks).AddMinutes(25).ToString(),
                FromCode = "JFK",
                FromName = "New York",
                ToCode = "SEA",
                ToName = "Seattle",
                Hours = "3h 15m",
                Price = 550,
                Stops = 2
            }
        };

        public async Task<IEnumerable<Deal>> GetDealsAsync()
        {
            await Task.Delay(500);

            return Deals;
        }
    }
}