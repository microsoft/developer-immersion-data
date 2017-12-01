using ContosoAir.Clients.Models;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.BingSpeech
{
    public interface IBingSpeechService
    {
        Task<SpeechResult> RecognizeSpeechAsync(string filename);
    }
}