using System.IO;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Emotion
{
    public interface IEmotionService
    {
        Task<float> GetHappinessAsync(Stream stream);

        Task<float> GetAverageHappinessScoreAsync(Stream stream);
    }
}
