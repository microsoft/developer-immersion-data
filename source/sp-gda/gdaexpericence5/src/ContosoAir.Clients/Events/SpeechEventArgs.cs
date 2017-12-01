using System;

namespace ContosoAir.Clients.Events
{
    public class SpeechEventArgs : EventArgs
    {
        public SpeechEventArgs(string message)
        {
            Message = message;
        }

        public string Message { get; set; }
    }
}
