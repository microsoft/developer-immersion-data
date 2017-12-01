using Plugin.Media;
using Plugin.Media.Abstractions;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Camera
{
    public class CameraService : ICameraService
    {
        public async Task<MediaFile> TakePhotoAsync()
        {
            MediaFile result = null;

            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakePhotoSupported)
            {
                return result;
            }

            try
            {
                var file = await CrossMedia.Current.TakePhotoAsync(new StoreCameraMediaOptions
                {
                    PhotoSize = PhotoSize.Small,
                    DefaultCamera = CameraDevice.Front
                });

                result = file;

                return result;
            }
            catch
            {
                return result;
            }
        }

        public async Task<MediaFile> PickPhotoAsync()
        {
            MediaFile result = null;

            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakePhotoSupported)
            {
                return result;
            }

            try
            {
                var file = await CrossMedia.Current.PickPhotoAsync();

                result = file;

                return result;
            }
            catch
            {
                return result;
            }
        }
    }
}
