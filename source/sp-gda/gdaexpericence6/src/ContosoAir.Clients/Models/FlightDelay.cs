using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Models
{
    public class FlightDelay
    {
        
            public string UserName { get; set; }
            public string SeatNumber { get; set; }
            public string FromCode { get; set; }
            public string ToCode { get; set; }
            public string EndDate { get; set; }
            public string ThereId { get; set; }
            public string BackId { get; set; }
            public IList<Flights> Flights { get; set; }              
    }

    public class Flights
    {
        public string Id { get; set; }
        public string Duration { get; set; }
        public string Price { get; set; }
        public string FromCode { get; set; }
        public string ToCode { get; set; }
        public string Distance { get; set; }
        public string Stop { get; set; }
        public string FlDate { get; set; }
        public IList<Segments> Segments { get; set; }
    }


    public class Segments
    {
        public string Airline { get; set; }
        public string Flight { get; set; }
        public string FromCode { get; set; }
        public string FromCity { get; set; }
        public string DepartTime { get; set; }
        public string AfterDelay { get; set; }
        public string ToCode { get; set; }
        public string ToCity { get; set; }
        public string ArrivalTime { get; set; }
        public bool IsDelay { get; set; }
        public string DelayBy { get; set; }
        public string Terminal { get; set; }
    }
}
