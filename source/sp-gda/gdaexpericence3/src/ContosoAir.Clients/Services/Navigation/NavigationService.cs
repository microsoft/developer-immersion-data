using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.Services.Msal;
using ContosoAir.Clients.ViewModels;
using ContosoAir.Clients.ViewModels.Base;
using ContosoAir.Clients.Views;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace ContosoAir.Clients.Services.Navigation
{
    public class NavigationService : INavigationService
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IPlatformParameterProvider _msalPlatformParameterProvider;

        protected readonly Dictionary<Type, Type> _mappings;

        protected Application CurrentApplication
        {
            get
            {
                return Application.Current;
            }
        }

        public NavigationService(
            IAuthenticationService authenticationService,
            IPlatformParameterProvider platformParameterProvider)
        {
            _authenticationService = authenticationService;
            _msalPlatformParameterProvider = platformParameterProvider;
            _mappings = new Dictionary<Type, Type>();

            CreatePageViewModelMappings();
        }

        public async Task InitializeAsync()
        {
            if (_authenticationService.IsAuthenticated)
            {
                await NavigateToAsync<MainViewModel>();
            }
            else
            {
                await NavigateToAsync<LoginViewModel>();
            }
        }

        public Task NavigateToAsync<TViewModel>() where TViewModel : ViewModelBase
        {
            return InternalNavigateToAsync(typeof(TViewModel), null);
        }

        public Task NavigateToAsync<TViewModel>(object parameter) where TViewModel : ViewModelBase
        {
            return InternalNavigateToAsync(typeof(TViewModel), parameter);
        }

        public Task NavigateToAsync(Type viewModelType)
        {
            return InternalNavigateToAsync(viewModelType, null);
        }

        public Task NavigateToAsync(Type viewModelType, object parameter)
        {
            return InternalNavigateToAsync(viewModelType, parameter);
        }

        public virtual async Task NavigateBackAsync()
        {
            if (CurrentApplication.MainPage is MainView)
            {
                var mainPage = CurrentApplication.MainPage as MainView;
                await mainPage.Detail.Navigation.PopAsync();
            }
            else if (CurrentApplication.MainPage != null)
            {
                await CurrentApplication.MainPage.Navigation.PopAsync();
            }
        }

        public virtual Task RemoveLastFromBackStackAsync()
        {
            var mainPage = CurrentApplication.MainPage as MainView;

            if (mainPage != null)
            {
                mainPage.Detail.Navigation.RemovePage(
                    mainPage.Detail.Navigation.NavigationStack[mainPage.Detail.Navigation.NavigationStack.Count - 1]);
            }

            return Task.FromResult(true);
        }

        protected virtual async Task InternalNavigateToAsync(Type viewModelType, object parameter)
        {
            Page page = CreateAndBindPage(viewModelType, parameter);
            SetNavigationIcon(page);

            if (page is MainView)
            {
                SetMainPage(page);
            }
            else if (page is LoginView)
            {
                SetMainPage(page);
            }
            else if (CurrentApplication.MainPage is MainView)
            {
                var mainPage = CurrentApplication.MainPage as MainView;
                var navigationPage = mainPage.Detail as CustomNavigationPage;

                if (navigationPage != null)
                {
                    await navigationPage.PushAsync(page);
                }
                else
                {
                    navigationPage = new CustomNavigationPage(page);
                    mainPage.Detail = navigationPage;
                }

                mainPage.IsPresented = false;
            }
            else
            {
                var navigationPage = CurrentApplication.MainPage as CustomNavigationPage;

                if (navigationPage != null)
                {
                    await navigationPage.PushAsync(page);
                }
                else
                {
                    SetMainPage(new CustomNavigationPage(page));
                }
            }

            await (page.BindingContext as ViewModelBase).InitializeAsync(parameter);
        }

        protected Type GetPageTypeForViewModel(Type viewModelType)
        {
            if (!_mappings.ContainsKey(viewModelType))
            {
                throw new KeyNotFoundException($"No map for ${viewModelType} was found on navigation mappings");
            }

            return _mappings[viewModelType];
        }

        protected Page CreateAndBindPage(Type viewModelType, object parameter)
        {
            Type pageType = GetPageTypeForViewModel(viewModelType);

            if (pageType == null)
            {
                throw new Exception($"Mapping type for {viewModelType} is not a page");
            }

            Page page = Activator.CreateInstance(pageType) as Page;
            ViewModelBase viewModel = ViewModelLocator.Instance.Resolve(viewModelType) as ViewModelBase;
            page.BindingContext = viewModel;

            return page;
        }

        protected virtual void SetNavigationIcon(Page page)
        {
            if (Device.OS == TargetPlatform.iOS)
            {
                if (page is ProfileView)
                {
                    NavigationPage.SetTitleIcon(page, null);
                }
                else
                {
                    NavigationPage.SetTitleIcon(page, "header");
                }
            }

            NavigationPage.SetBackButtonTitle(page, "Back");
        }

        protected virtual void SetMainPage(Page page)
        {
            if (CurrentApplication.MainPage != null)
            {
                var viewModel = CurrentApplication.MainPage.BindingContext as ViewModelBase;
                viewModel?.Dispose();
            }

            CurrentApplication.MainPage = page;

            IPlatformParameters plaformParameters = 
                _msalPlatformParameterProvider.GetPlatformParameters();

            if (plaformParameters != null)
            {
                App.AuthenticationClient.PlatformParameters = plaformParameters;
            }
        }

        private void CreatePageViewModelMappings()
        {
            _mappings.Add(typeof(BotViewModel), typeof(BotView));
            _mappings.Add(typeof(CheckInViewModel), typeof(CheckInView));
            _mappings.Add(typeof(ConfirmationViewModel), typeof(ConfirmationView));
            _mappings.Add(typeof(FeedbackViewModel), typeof(FeedbackView));
            _mappings.Add(typeof(FindFlightsViewModel), typeof(FindFlightsView));
            _mappings.Add(typeof(LoginViewModel), typeof(LoginView));
            _mappings.Add(typeof(MainViewModel), typeof(MainView));
            _mappings.Add(typeof(MyTripsViewModel), typeof(MyTripsView));
            _mappings.Add(typeof(ProfileViewModel), typeof(ProfileView));
            _mappings.Add(typeof(SettingsViewModel), typeof(SettingsView));
            _mappings.Add(typeof(SignUpViewModel), typeof(SignUpView));
            _mappings.Add(typeof(ThankViewModel), typeof(ThankView));
            _mappings.Add(typeof(SoloServiceViewModel), typeof(SoloServiceView));
        }
    }
}