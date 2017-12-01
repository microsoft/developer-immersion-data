using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ContosoAir.Clients.Models;

namespace ContosoAir.Clients.Models
{
    class FlightAlternatives
    {
        public FlightAlternatives()
        {
            Flights = new List<FlightData>();
        }       
        public List<FlightData> Flights { get; set; }
    }
}
