using Contoso.Clients.DataServices.Base;
using ContosoAir.Clients.DataServices.Trips;
using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.Services.Msal;
using Microsoft.Identity.Client;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace ContosoAir.Clients.DataServices.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private string[] DefaultUsers = new [] { "me@contoso.com", "erika@contoso.com", "sarah@contoso.com" };
        private const string DefaultUserID = "default";
        private const string ExternalSigninProvider = "External";
        private readonly IBrowserCookiesService _browserCookiesService;
        private readonly ITripsService _tripsService;

        public AuthenticationService(
            IBrowserCookiesService browserCookiesService,
            ITripsService tripsService)
        {
            _browserCookiesService = browserCookiesService;
            _tripsService = tripsService;
        }

        public bool IsAuthenticated
        {
            get
            {
                return Settings.AuthSettings;
            }
        }

        public async Task<bool> LoginAsync(string email, string password)
        {
            bool succeeded = false;

            if (DefaultUsers.Any((u) => u.Equals(email, StringComparison.CurrentCultureIgnoreCase)))
            {
                Settings.UserName = email ?? string.Empty;

                succeeded = true;
            }

            Settings.AuthSettings = succeeded;
            RegisterUserIdentifier(DefaultUserID);

            await Task.Delay(1000);

            return succeeded;
        }

        public async Task<Profile> GetProfileAsync()
        {
            await Task.Delay(500);

            if (string.IsNullOrEmpty(Settings.UserName))
            {
                return new Profile();
            }

            if (Settings.UserName.Equals("erika@contoso.com", StringComparison.CurrentCultureIgnoreCase) ||
                Settings.UserName.Contains("Ehrli"))
            {
                return new Profile
                {
                    Name = "Erika Ehrli",
                    Image = Device.OS == TargetPlatform.Windows ? "Assets/erika.jpg" : "erika",
                    Email = "eehrli@microsoft.com",
                    Skype = "mseehrli"
                };
            }
            else if (Settings.UserName.Equals("nrangan@contoso.com", StringComparison.CurrentCultureIgnoreCase) ||
                Settings.UserName.Contains("Nagu"))
            {
                return new Profile
                {
                    Name = "Nagu Rangan",
                    Image = Device.OS == TargetPlatform.Windows ? "Assets/nagu.jpg" : "nagu",
                    Email = "nrangan@microsoft.com",
                    Skype = "msnrangan"
                };
            }
            else if (Settings.UserName.Equals("sarah@contoso.com", StringComparison.CurrentCultureIgnoreCase))
            {
                return new Profile
                {
                    Name = "Sarah Doe",
                    Image = Device.OS == TargetPlatform.Windows ? "Assets/sarah.jpg" : "sarah",
                    Email = "sarah@contoso.com",
                    Skype = "contosarah"
                };
            }
            else
            {
                return new Profile
                {
                    Name = Settings.UserName,
                    Image = Device.OS == TargetPlatform.Windows ? "Assets/default_profile.png" : "default_profile",
                    Email = string.Empty,
                    Skype = string.Empty
                };
            }
        }

        public async Task<bool> LoginWithMicrosoftAsync()
        {
            bool succeeded = false;

            try
            {
                var result = await App.AuthenticationClient.AcquireTokenAsync(
                  new String[]{ Settings.ClientId },
                  string.Empty,
                  UiOptions.SelectAccount,
                  string.Empty,
                  null,
                  $"{GlobalSettings.Authority}{Settings.Tenant}",
                  Settings.SignUpSignInPolicy);

                succeeded = true;

                Settings.UserName = result.User?.Name ?? string.Empty;
                Settings.SigninProvider = ExternalSigninProvider;
                RegisterUserIdentifier(result.User.UniqueId);
            }
            catch (MsalException ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error with MSAL authentication: {ex}");
                throw new ServiceAuthenticationException();
            }

            Settings.AuthSettings = succeeded;

            return succeeded;
        }

        public async Task LogoutAsync()
        {
            Settings.RemoveAuth();
            App.AuthenticationClient.UserTokenCache.Clear(Settings.ClientId);
            await _tripsService.SetCurrentFlightStatusAsync(FlightStatus.CheckInAvailable);

            // MSAL uses native embedded browser for sign-in process, where 
            // authentication cookies are persisted. To enable a full log in/out 
            // behavior, we should clear all browser cookies before signing in again
            await _browserCookiesService.ClearCookiesAsync();
        }

        private void RegisterUserIdentifier(string userId)
        {
            Settings.UserId = userId;
            System.Diagnostics.Debug.WriteLine($"New UserId value is {userId}");
        }
    }
}