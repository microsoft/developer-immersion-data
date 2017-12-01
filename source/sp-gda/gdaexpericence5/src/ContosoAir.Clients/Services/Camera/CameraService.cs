using Newtonsoft.Json;
using Plugin.Media;
using Plugin.Media.Abstractions;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;


namespace ContosoAir.Clients.Services.Camera
{
    public class CameraService : ICameraService
    {
        public string tempjson = "";

        public HttpResponseMessage tempresponse;

        private JsonSerializerSettings _serializerSettings;

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

        public HttpClient CreateHttpClient()
        {
            var httpClient = new HttpClient();

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return httpClient;
        }

        public async Task HandleResponse(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                if (response.StatusCode == HttpStatusCode.Forbidden || response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    throw new Exception(content);
                }

                throw new HttpRequestException(content);
            }
        }

        //Method for inserting the flight feedback data into CosmosDB using Azure Function
        public async Task<string> PutAsync<FlightFeedbackData>(string uri, FlightFeedbackData ffd)
        {
            HttpClient httpClient = CreateHttpClient();

            string serialized = await Task.Run(() => JsonConvert.SerializeObject(ffd, _serializerSettings));

            tempjson = serialized;

            HttpResponseMessage response = await httpClient.PostAsync(uri, new StringContent(serialized, Encoding.UTF8, "application/json"));

            tempresponse = response;

            await HandleResponse(response);

            var responseData = await response.Content.ReadAsStringAsync();

            return await Task.Run(() =>(responseData));
        }


    }

}
