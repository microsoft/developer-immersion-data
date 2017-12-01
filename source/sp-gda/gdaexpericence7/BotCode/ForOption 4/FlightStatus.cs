using System;

namespace SimpleEchoBot.Models
{
    [Serializable]
    public class FlightStatus
    {
        public string Flight { get; set; }
        public string FromTerminalNo { get; set; }
        public string FromGateNo { get; set; }
        public string departTime { get; set; }
    }
}