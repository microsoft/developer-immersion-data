using ContosoAir.Clients.Events;
using ContosoAir.Clients.Services.AudioRecorder;
using ContosoAir.Clients.Services.BingSpeech;
using ContosoAir.Clients.Services.Camera;
using ContosoAir.Clients.Services.Emotion;
using ContosoAir.Clients.Services.Speech;
using ContosoAir.Clients.Validations;
using ContosoAir.Clients.ViewModels.Base;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.Views;
using ContosoAir.Clients.Services.Notifications;
using Xamarin.Forms;
using ContosoAir.Clients.DataServices.Feedback;
using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.Windows.Input;



namespace ContosoAir.Clients.ViewModels
{
    public class FeedbackViewModel : ViewModelBase
    {
        private string _image;
        private ValidatableObject<string> _description;
        private float _rating;
        private bool _isRecording;
        private bool _isValid;
        public float feedbackScoreData;
        string demoValue = null;
        float feedbackResponseValue;
        public static string demoFeedback = "";
        public float calculatedResult;

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
            
            if (result == null)
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
        

        private async void Submit()
        {
            //Access selected flightId
            var demoFlight = ContosoAir.Clients.Views.FeedbackView.name;

            //Image path where image is stored
            var imageVal = Image;

            //Feedback description text which is convered by Bing Speech API
            var feedbackDesc = Description.Value;

            //Image rating which given by Emotion API
            var imageRating = Rating;

            FlightFeedbackData FeedbackValue = new FlightFeedbackData
            {
                flightId = demoFlight,
                ratingOnEmotion = imageRating,
                feedbackText = feedbackDesc
            };

            if (feedbackDesc == null)
            {
                // Give alert if feedback Description text is empty
                await DialogService.ShowAlertAsync("", "Please provide feedback description", "Try again");
            }
            else
            {
                //URL of Logic App with FeedbackValue parameter
                var statusValue = await _cameraService.PutAsync<FlightFeedbackData>(Settings.LogicAppUrl, FeedbackValue);
                demoValue = statusValue;
            }

            IsBusy = true;
            IsValid = true;
            bool isValid = Validate();

            if (isValid)
            {
                feedbackResponseValue = float.Parse(demoValue);

                /*Start Code for analyse ratingOnEmotinScore and Text aanalytics score for Rendaring message*/

                if (imageRating != 0)
                {
                    calculatedResult = (imageRating + feedbackResponseValue) / 2;
                    feedbackResponseValue = calculatedResult;
                }
                /*End Code for analyse ratingOnEmotinScore and Text aanalytics score for Rendaring message*/

                if (feedbackResponseValue >= 0.5)
                {
                    //Thank you message will render to end user
                    demoFeedback = "good";
                }
                else
                {
                    //Due to feedbackScore is bad, a free drink coupen message will render to the end user
                    demoFeedback = "bad";
                }

                await NavigationService.NavigateToAsync<ThankViewModel>();
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


}