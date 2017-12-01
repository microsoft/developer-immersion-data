using ContosoAir.Clients.Validations;
using ContosoAir.Clients.ViewModels.Base;
using System;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class SignUpViewModel : ViewModelBase
    {
        private ValidatableObject<string> _username;
        private ValidatableObject<string> _email;
        private ValidatableObject<string> _password;
        private bool _isValid;

        public SignUpViewModel()
        {
            _username = new ValidatableObject<string>();
            _email = new ValidatableObject<string>();
            _password = new ValidatableObject<string>();

            AddValidations();
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

        public ICommand SignUpCommand => new Command(SignUpAsync);

        public ICommand CancelCommand => new Command(CancelAsync);

        public ICommand MicrosoftSignInCommand => new Command(MicrosoftSignIn);

        public ValidatableObject<string> Username
        {
            get
            {
                return _username;
            }
            set
            {
                _username = value;
                RaisePropertyChanged(() => Username);
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

        private async void SignUpAsync()
        {
            try
            {
                IsBusy = true;
                IsValid = true;
                bool isValid = Validate();

                if (isValid)
                {
                    await NavigationService.NavigateToAsync<LoginViewModel>();
                }
                else
                {
                    IsValid = false;
                }
            }
            catch (Exception)
            {
                await DialogService.ShowAlertAsync("Please, try again", "Sign up error", "Ok");
            }
            finally
            {
                IsBusy = false;
            }
        }

        private async void CancelAsync()
        {
            await NavigationService.NavigateToAsync<LoginViewModel>();
        }

        private void MicrosoftSignIn()
        {

        }

        private bool Validate()
        {
            bool isValidUsername = _username.Validate();
            bool isValidEmail = _email.Validate();
            bool isValidPassword = _password.Validate();

            return isValidUsername && isValidEmail && isValidPassword;
        }

        private void AddValidations()
        {
            _username.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "Username should not be empty" });
            _email.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "Email should not be empty" });
            _email.Validations.Add(new EmailRule<string> { ValidationMessage = "Invalid email address" });
            _password.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "Password should not be empty" });
        }
    }
}