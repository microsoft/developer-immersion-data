using System;

namespace ContosoAir.Clients.Services.Speech
{
    public interface ISpeechService
    {
        event EventHandler OnMessageFired;
        void StartRecording();
        void StopRecording();
    }
}