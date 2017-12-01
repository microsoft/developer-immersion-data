using Contoso.Clients.DataServices.Base;
using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.Validations;
using ContosoAir.Clients.ViewModels.Base;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class LoginViewModel : ViewModelBase
    {
        private ValidatableObject<string> _email;
        private ValidatableObject<string> _password;
        private bool _isValid;
        private readonly IAuthenticationService _authenticationService;

        public LoginViewModel(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
            _email = new ValidatableObject<string>();
            _password = new ValidatableObject<string>();

            AddValidations();
        }

        public ValidatableObject<string> Email
        {
            get
            {
                return _email;
            }
            set
            {
                _email = value;
                RaisePropertyChanged(() => Email);
            }
        }

        public ValidatableObject<string> Password
        {
            get
            {
                return _password;
            }
            set
            {
                _password = value;
                RaisePropertyChanged(() => Password);
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

        public ICommand SignInCommand => new Command(SignInAsync);

        public ICommand MicrosoftSignInCommand => new Command(MicrosoftSignInAsync);

        public ICommand SignUpCommand => new Command(SignUpAsync);

        public ICommand SettingsCommand => new Command(SettingsAsync);

        private async void SignInAsync()
        {
            IsBusy = true;
            IsValid = true;
            bool isValid = Validate();
            bool isAuthenticated = false;

            if (isValid)
            {
                try
                {
                    isAuthenticated = await _authenticationService.LoginAsync(Email.Value, Password.Value);
                }
                catch (ServiceAuthenticationException)
                {
                    await DialogService.ShowAlertAsync("Invalid credentials", "Login failure", "Try again");
                }
                catch (Exception ex) when (ex is WebException || ex is HttpRequestException)
                {
                    Debug.WriteLine($"[SignIn] Error signing in: {ex}");
                    await DialogService.ShowAlertAsync("Communication error", "Error", "Ok");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"[SignIn] Error signing in: {ex}");
                }
            }
            else
            {
                IsValid = false;
            }

            if (isAuthenticated)
            {
                await NavigationService.NavigateToAsync<MainViewModel>();
            }

            IsBusy = false;
        }

        private async void MicrosoftSignInAsync()
        {
            try
            {
                IsBusy = true;

                bool succeeded = await _authenticationService.LoginWithMicrosoftAsync();

                if (succeeded)
                {
                    await NavigationService.NavigateToAsync<MainViewModel>();
                }
            }
            catch (ServiceAuthenticationException)
            {
                await DialogService.ShowAlertAsync("Please, try again", "Login error", "Ok");
            }
            finally
            {
                IsBusy = false;
            }
        }

        private async void SignUpAsync()
        {
            await NavigationService.NavigateToAsync<SignUpViewModel>();
        }

        private async void SettingsAsync()
        {
            await NavigationService.NavigateToAsync<SettingsViewModel>();
        }

        private bool Validate()
        {
            bool isValidEmail = _email.Validate();
            bool isValidPassword = _password.Validate();

            return isValidEmail && isValidPassword;
        }

        private void AddValidations()
        {
            _email.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "Email should not be empty" });
            _email.Validations.Add(new EmailRule<string> { ValidationMessage = "Invalid email address" });
            _password.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "Password should not be empty" });
        }
    }
}