using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Models
{
    public class FlightDelayDetails
    {
        public bool LodingIcon { get; set; }
        public string DepartingFlightId { get; set; }
        public string DepartingFlightName { get; set; }
        public string DepartingFlightSorce { get; set; }
        public string DepartingFlightDest { get; set; }
        public string DepartingFlightDTimeBD { get; set; } // depart time before Delay
        public string DepartingFlightDTimeAD { get; set; } // depart time after Delay
        public string DepartingFlightATime { get; set; } // arrival time
        public string DepartingFlightChangedGate { get; set; }
        public string DepartingFlightDelayBy { get; set; }
        public string DepartingFlightMsg { get; set; }

        public string ReturnFlightId { get; set; }
        public string ReturnFlightName { get; set; }
        public string ReturnFlightSorce { get; set; }
        public string ReturnFlightDest { get; set; }
        public string ReturnFlightDTimeBD { get; set; } // depart time before Delay
        public string ReturnFlightDTimeAD { get; set; } // depart time after Delay
        public string ReturnFlightATime { get; set; } // arrival time
        public string ReturnFlightChangedGate { get; set; }
        public string ReturnFlightDelayBy { get; set; }
        public string ReturnFlightMsg { get; set; }

    }
}
