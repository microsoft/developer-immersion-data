using ContosoAir.Clients.Events;
using ContosoAir.Clients.Services.AudioRecorder;
using ContosoAir.Clients.Services.BingSpeech;
using ContosoAir.Clients.Services.Camera;
using ContosoAir.Clients.Services.Emotion;
using ContosoAir.Clients.Services.Speech;
using ContosoAir.Clients.Validations;
using ContosoAir.Clients.ViewModels.Base;
using ContosoAir.Clients.Models;
using Xamarin.Forms;
using ContosoAir.Clients.DataServices.Feedback;
using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.Windows.Input;
//using Xamarin.Forms;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using Windows.UI.Popups;

namespace ContosoAir.Clients.ViewModels
{
    public class FeedbackViewModel : ViewModelBase
    {
        private string _image;
        private ValidatableObject<string> _description;
        private float _rating;
        private bool _isRecording;
        private bool _isValid;

        private ICameraService _cameraService;
        private IEmotionService _emotionService;
        private IBingSpeechService _bingSpeechService;

        public FeedbackViewModel(
            ICameraService cameraService,
            IEmotionService emotionService, 
            IBingSpeechService bingSpeechService)
        {
            _cameraService = cameraService;
            _emotionService = emotionService;
            _bingSpeechService = bingSpeechService;

            _description = new ValidatableObject<string>();

            AddValidations();
        }

        public string Image
        {
            get
            {
                return _image;
            }
            set
            {
                _image = value;
                RaisePropertyChanged(() => Image);
            }
        }

        public ValidatableObject<string> Description
        {
            get
            {
                return _description;
            }
            set
            {
                _description = value;
                RaisePropertyChanged(() => Description);
            }
        }

        public float Rating
        {
            get
            {
                return _rating;
            }
            set
            {
                _rating = value;
                RaisePropertyChanged(() => Rating);
            }
        }

        public bool IsRecording
        {
            get
            {
                return _isRecording;
            }
            set
            {
                _isRecording = value;
                RaisePropertyChanged(() => IsRecording);
            }
        }

        public bool IsValid
        {
            get
            {
                return _isValid;
            }
            set
            {
                _isValid = value;
                RaisePropertyChanged(() => IsValid);
            }
        }

        public ICommand CameraCommand => new Command(OnCameraAsync);

        public ICommand MicCommand => new Command(OnRecognizeSpeechAsync);

        public ICommand SubmitCommand => new Command(Submit);

        public ICommand CancelCommand => new Command(Cancel);

        private async void OnCameraAsync()
        {
            var result = await _cameraService.TakePhotoAsync();

            if(result == null)
            {
                await DialogService.ShowAlertAsync("Can't access camera!", "Camera failure", "Try again");

                return;
            }

            if (!string.IsNullOrEmpty(result.Path))
            {
                Image = result.Path;

                try
                {
                    using (var photoStream = result.GetStream())
                    {
                        var rating = await _emotionService.GetAverageHappinessScoreAsync(photoStream);
                        Rating = (rating * 10) / 2;
                    }
                }
                catch(Exception)
                {
                    Rating = 0;

                    await DialogService.ShowAlertAsync("Can't detect face!", "Face detection failure", "Try again");
                }
            }

            result = null;
        }

        private async void OnRecognizeSpeechAsync()
        {
            try
            {
                if (Device.OS == TargetPlatform.iOS)
                {
                    var speechService = DependencyService.Get<ISpeechService>();
 
                    speechService.OnMessageFired += (sender, args) =>
                    {
                        var argument = args as SpeechEventArgs;
                        if (argument != null)
                        {
                            Description.Value = argument.Message;
                        }
                    };

                    if (IsRecording)
                    {
                        speechService.StartRecording();
                    }
                    else
                    {
                        speechService.StopRecording();
                    }
                }
                else
                {
                    var audioRecordingService = DependencyService.Get<IAudioRecorderService>();

                    if (IsRecording)
                    {
                        audioRecordingService.StartRecording();
                    }
                    else
                    {
                        audioRecordingService.StopRecording();
                    }

                    if (!IsRecording)
                    {
                        var speechResult = await _bingSpeechService.RecognizeSpeechAsync(GlobalSettings.AudioFilename);
                        Debug.WriteLine("Name: " + speechResult.Name);
                        Debug.WriteLine("Confidence: " + speechResult.Confidence);

                        if (!string.IsNullOrWhiteSpace(speechResult.Name))
                        {
                            Description.Value =
                                char.ToUpper(speechResult.Name[0]) + speechResult.Name.Substring(1);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);

                await DialogService.ShowAlertAsync("Can't detect speech!", "Audio record failure", "Try again");
            }
        }


        

        private void Submit()
        {
            var demoFlight = ContosoAir.Clients.Views.FeedbackView.name;

            var imageVal = Image;
            var feedbackDesc = Description.Value;
            var imageRating = Rating;

            FlightFeedbackData FeedbackValue = new FlightFeedbackData
            {
                flightId = demoFlight,
                ratingOnEmotion = imageRating,
                feedbackText = feedbackDesc
            };

            if (feedbackDesc == null)
            {
                var dialog = new MessageDialog("Please give description");
            }
            else
            {
                //URL of Logic App with FeedbackValue parameter
                _cameraService.PutAsync<FlightFeedbackData>("https://prod-42.westus.logic.azure.com:443/workflows/50e4276e308147979d02473f25dfed97/triggers/request/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Frequest%2Frun&sv=1.0&sig=Xvy65VFlwRCfum2hLRoZwSt3W5Q725Xkm-rHmTP7tJE", FeedbackValue);
            }

            //URL of Logic App with FeedbackValue parameter
            //_cameraService.PutAsync<FlightFeedbackData>("https://prod-42.westus.logic.azure.com:443/workflows/50e4276e308147979d02473f25dfed97/triggers/request/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Frequest%2Frun&sv=1.0&sig=Xvy65VFlwRCfum2hLRoZwSt3W5Q725Xkm-rHmTP7tJE", FeedbackValue);

            IsBusy = true;
            IsValid = true;
            bool isValid = Validate();

            if (isValid)
            {
                NavigationService.NavigateToAsync<ThankViewModel>();
            }
            else
            {
                IsValid = false;
            }

            IsBusy = false;
        }

        private async void Cancel()
        {
            await NavigationService.RemoveLastFromBackStackAsync();
            await NavigationService.NavigateToAsync<MainViewModel>();
        }

        private bool Validate()
        {
            bool isValidDescription = _description.Validate();
            bool isValidRating = Rating >= 0;

            return isValidDescription && isValidRating;
        }

        private void AddValidations()
        {
            _description.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "Description should not be empty" });
        }


    }

    //public class Rating
    //{
    //    public float ratingOnEmotion { get; set; }
    //    public string feedbackText { get; set; }
    //    public string flightId { get; set; }
    //}
}