using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.Services.Notifications;
using ContosoAir.Clients.ViewModels.Base;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using System;

namespace ContosoAir.Clients.ViewModels
{
    public class ProfileViewModel : ViewModelBase
    {
        private Profile _profile;

        private readonly IAuthenticationService _authenticationService;
        private readonly INativePushNotificationService _nativePushNotificationService;

        public ProfileViewModel(
            IAuthenticationService authenticationService,
            INativePushNotificationService nativePushNotificationService)
        {
            _authenticationService = authenticationService;
            _nativePushNotificationService = nativePushNotificationService;
        }

        public Profile Profile
        {
            get
            {
                return _profile;
            }
            set
            {
                _profile = value;
                RaisePropertyChanged(() => Profile);
            }
        }

        public ICommand LogoutCommand => new Command(OnLogoutAsync);

        public override async Task InitializeAsync(object navigationData)
        {
            try
            {
                var profile = await _authenticationService.GetProfileAsync();

                if (profile != null)
                {
                    Profile = profile;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading profile data: {ex}");
            }
        }

        private async void OnLogoutAsync()
        {
            try
            {
                await _authenticationService.LogoutAsync();
                await NavigationService.NavigateToAsync<LoginViewModel>();

#if !ENABLE_TEST_CLOUD
                await _nativePushNotificationService.RemoveRegistrations();
#endif
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error on logout: {ex}");
            }
        }
    }
}