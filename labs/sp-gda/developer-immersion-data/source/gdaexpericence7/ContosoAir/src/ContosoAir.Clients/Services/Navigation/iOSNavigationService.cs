using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.Services.Msal;
using ContosoAir.Clients.ViewModels;
using ContosoAir.Clients.ViewModels.Base;
using ContosoAir.Clients.Views;
using System;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace ContosoAir.Clients.Services.Navigation
{
    public class iOSNavigationService : NavigationService
    {
        private Type _requestedPageType;
        private object _requestedNavigationParameter;

        public iOSNavigationService(
            IAuthenticationService authenticationService,
            IPlatformParameterProvider platformParameterProvider)
            : base(authenticationService, platformParameterProvider)
        {
            CreatePageViewModelMappings();
        }

        public override Task RemoveLastFromBackStackAsync()
        {
            if (CurrentApplication.MainPage is iOSMainView)
            {
                var mainView = CurrentApplication.MainPage as iOSMainView;
                var currentPage = mainView.CurrentPage as CustomNavigationPage;

                if (currentPage != null && currentPage.Navigation.NavigationStack.Count > 1)
                {
                    currentPage.Navigation.RemovePage(
                        currentPage.Navigation.NavigationStack[currentPage.Navigation.NavigationStack.Count - 2]);
                }
            }

            return Task.FromResult(true);
        }

        public override async Task NavigateBackAsync()
        {
            if (CurrentApplication.MainPage is iOSMainView)
            {
                var mainPage = CurrentApplication.MainPage as iOSMainView;
                var currentPage = mainPage.CurrentPage as CustomNavigationPage;

                await currentPage?.Navigation.PopAsync();
            }
            else if (CurrentApplication.MainPage is CustomNavigationPage)
            {
                var currentPage = CurrentApplication.MainPage as CustomNavigationPage;
                await currentPage.Navigation.PopAsync();
            }
        }

        protected override async Task InternalNavigateToAsync(Type viewModelType, object parameter)
        {
            Page page = CreateAndBindPage(viewModelType, parameter);
            _requestedPageType = page.GetType();
            _requestedNavigationParameter = parameter;

            if (page is iOSMainView)
            {
                InitalizeMainPage(page as iOSMainView);
                await InitializeTabPageCurrentPageViewModelAsync(parameter);
            }
            else if (page is LoginView)
            {
                var mainView = CurrentApplication.MainPage as iOSMainView;

                if (mainView != null)
                {
                    mainView.CurrentPageChanged -= MainViewPageChanged;
                }

                SetMainPage(new CustomNavigationPage(page));
                await InitializePageViewModelAsync(page, parameter);
            }
            else if (CurrentApplication.MainPage is iOSMainView)
            {
                var mainPage = CurrentApplication.MainPage as iOSMainView;
                bool tabPageFound = mainPage.TrySetCurrentPage(page);
                SetNavigationIcon(page);

                if (tabPageFound)
                {
                    var navigationPage = mainPage.CurrentPage as CustomNavigationPage;

                    if (navigationPage != null)
                    {
                        await InitializePageViewModelAsync(navigationPage.CurrentPage, parameter);
                    }
                }
                else
                {
                    await mainPage.CurrentPage.Navigation.PushAsync(page);
                    await InitializePageViewModelAsync(page, parameter);
                }
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

                await InitializePageViewModelAsync(page, parameter);
            }
        }

        private Task InitializePageViewModelAsync(Page page, object parameter)
        {
            return (page.BindingContext as ViewModelBase).InitializeAsync(parameter);
        }

        private Task InitializeTabPageCurrentPageViewModelAsync(object parameter)
        {
            var mainPage = CurrentApplication.MainPage as iOSMainView;
            return ((mainPage.CurrentPage as CustomNavigationPage).CurrentPage.BindingContext as ViewModelBase).InitializeAsync(parameter);
        }

        private void InitalizeMainPage(iOSMainView mainPage)
        {
            SetMainPage(mainPage);

            var myTripsPage = CreateAndBindPage(typeof(MyTripsViewModel), null);
            SetNavigationIcon(myTripsPage);
            mainPage.AddPage(myTripsPage, "My Trips");

            var findFlightsPage = CreateAndBindPage(typeof(FindFlightsViewModel), null);
            SetNavigationIcon(findFlightsPage);
            mainPage.AddPage(findFlightsPage, "Find flights");

            var contactPage = CreateAndBindPage(typeof(BotViewModel), null);
            SetNavigationIcon(contactPage);
            mainPage.AddPage(contactPage, "Contact");

            var profilePage = CreateAndBindPage(typeof(ProfileViewModel), null);
            SetNavigationIcon(profilePage);
            mainPage.AddPage(profilePage, "Profile");

			InitializePageViewModelAsync(mainPage, _requestedNavigationParameter);
            mainPage.CurrentPageChanged += MainViewPageChanged;
        }

        private void CreatePageViewModelMappings()
        {
            if (_mappings.ContainsKey(typeof(MainViewModel)))
            {
                _mappings[typeof(MainViewModel)] = typeof(iOSMainView);
            }
            else
            {
                _mappings.Add(typeof(MainViewModel), typeof(iOSMainView));
            }
        }

        private void MainViewPageChanged(object sender, EventArgs e)
        {
            var mainPage = sender as iOSMainView;

            if (mainPage == null) return;

            if (mainPage.CurrentPage == null)
            {
                return;
            }

            if (!mainPage.CurrentPage.IsEnabled)
            {
                mainPage.CurrentPage = mainPage.PreviousPage;
            }
            else
            {
                mainPage.PreviousPage = mainPage.CurrentPage;
            }

            InitializeTabPageCurrentPageViewModelAsync(null);
        }
    }
}