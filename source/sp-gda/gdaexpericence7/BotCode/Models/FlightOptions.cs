using System;

namespace SimpleEchoBot.Models
{   
    [Serializable]
    public class FlightOptions
    {
        public int Id { get; set; }
        public string Departure { get; set; }
        public string Arrival { get; set; }
        public int Stops { get; set; }
        public byte[] Image { get; set; }
        public byte[] BoardingPass { get; set; }
        public byte[] Map { get; set; }
        public bool Flag { get; set; }
    }
}