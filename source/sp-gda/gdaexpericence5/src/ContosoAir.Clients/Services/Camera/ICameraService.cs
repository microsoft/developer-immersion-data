using Plugin.Media.Abstractions;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Camera
{
    public interface ICameraService
    {
        Task<MediaFile> TakePhotoAsync();
        Task<MediaFile> PickPhotoAsync();

        Task<string> PutAsync<FlightFeedbackData>(string uri, FlightFeedbackData ffd);
    }
}
