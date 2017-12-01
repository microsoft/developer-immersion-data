using System;
using System.Collections.Generic;

namespace SimpleEchoBot.Models
{
    [Serializable]
    public class Alternatives
    {
        public Alternatives()
        {
            Flights = new List<FlightOptions>();
        }
        public string from { get; set; }
        public string to { get; set; }
        public List<FlightOptions> Flights { get; set; }

    }
}