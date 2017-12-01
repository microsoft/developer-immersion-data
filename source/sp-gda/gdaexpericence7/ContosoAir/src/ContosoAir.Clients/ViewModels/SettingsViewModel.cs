using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.Services.Dialog;
using ContosoAir.Clients.ViewModels.Base;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class SettingsViewModel : ViewModelBase
    {
        private readonly IDialogService _dialogService;
        private bool _notificationHasChanged;

        public SettingsViewModel(IDialogService dialogService)
        {
            _dialogService = dialogService;
            _notificationHasChanged = false;
        }

        public int DelayedTime
        {
            get { return Settings.DelayedTime; }
            set
            {
                Settings.DelayedTime = value;
                RaisePropertyChanged(() => DelayedTime);
            }
        }

        public int FeedbackTime
        {
            get { return Settings.FeedbackTime; }
            set
            {
                Settings.FeedbackTime = value;
                RaisePropertyChanged(() => FeedbackTime);
            }
        }

        public string ContosoAirEndpoint
        {
            get { return Settings.ContosoAirEndpoint; }
            set
            {
                Settings.ContosoAirEndpoint = value;
                RaisePropertyChanged(() => ContosoAirEndpoint);
            }
        }

        public string Tenant
        {
            get { return Settings.Tenant; }
            set
            {
                Settings.Tenant = value;
                RaisePropertyChanged(() => Tenant);
            }
        }

        public string ClientId
        {
            get { return Settings.ClientId; }
            set
            {
                Settings.ClientId = value;
                RaisePropertyChanged(() => ClientId);
            }
        }

        public string SignUpSignInPolicy
        {
            get { return Settings.SignUpSignInPolicy; }
            set
            {
                Settings.SignUpSignInPolicy = value;
                RaisePropertyChanged(() => SignUpSignInPolicy);
            }
        }

        public string SkypeBotAccount
        {
            get { return Settings.SkypeBotAccount; }
            set
            {
                Settings.SkypeBotAccount = value;
                RaisePropertyChanged(() => SkypeBotAccount);
            }
        }



        public string CognitiveServicesKey
        {
            get { return Settings.CognitiveServicesKey; }
            set
            {
                Settings.CognitiveServicesKey = value;
                RaisePropertyChanged(() => CognitiveServicesKey);
            }
        }

        public string BingSpeechApiKey
        {
            get { return Settings.BingSpeechApiKey; }
            set
            {
                Settings.BingSpeechApiKey = value;
                RaisePropertyChanged(() => BingSpeechApiKey);
            }
        }

        public string NotificationHubName
        {
            get { return Settings.NotificationHubName; }
            set
            {
                if (!value.Equals(Settings.NotificationHubName))
                {
                    Settings.NotificationHubName = value;
                    RaisePropertyChanged(() => NotificationHubName);
                    _notificationHasChanged = true;
                }
            }
        }

        public string NotificationHubConnectionString
        {
            get { return Settings.NotificationHubConnectionString; }
            set
            {
                if (!value.Equals(Settings.NotificationHubConnectionString))
                {
                    Settings.NotificationHubConnectionString = value;
                    RaisePropertyChanged(() => NotificationHubConnectionString);
                    _notificationHasChanged = true;
                }
            }
        }

        public string AndroidProjectNumber
        {
            get { return Settings.AndroidProjectNumber; }
            set
            {
                if (!value.Equals(Settings.AndroidProjectNumber))
                {
                    Settings.AndroidProjectNumber = value;
                    RaisePropertyChanged(() => AndroidProjectNumber);
                    _notificationHasChanged = true;
                }
            }
        }

        public ICommand AcceptCommand => new Command(AcceptAsync);

        private async void AcceptAsync()
        {
            if (_notificationHasChanged)
            {
                await _dialogService.ShowAlertAsync("The notification hub change requires to restart the app.", "Restart required", "Ok");
            }
            await NavigationService.NavigateToAsync<LoginViewModel>();
        }
    }
}