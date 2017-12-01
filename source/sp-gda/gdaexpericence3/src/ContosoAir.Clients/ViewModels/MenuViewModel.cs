using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.Services.Notifications;
using ContosoAir.Clients.ViewModels.Base;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class MenuViewModel : ViewModelBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly INativePushNotificationService _nativePushNotificationService;
        private ObservableCollection<Models.MenuItem> _menuItems = new ObservableCollection<Models.MenuItem>();
        private Profile _profile;

        public MenuViewModel(IAuthenticationService authenticationService, INativePushNotificationService nativePushNotificationService)
        {
            _authenticationService = authenticationService;
            _nativePushNotificationService = nativePushNotificationService;
            InitMenuItems();
        }

        public ObservableCollection<Models.MenuItem> MenuItems
        {
            get
            {
                return _menuItems;
            }
            set
            {
                _menuItems = value;
                RaisePropertyChanged(() => MenuItems);
            }
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

        public ICommand ItemSelectedCommand => new Command<Models.MenuItem>(OnSelectItem);

        public ICommand LogoutCommand => new Command(OnLogout);

        private void InitMenuItems()
        {
            MenuItems.Add(new Models.MenuItem
            {
                Title = "My Trips",
                MenuItemType = MenuItemType.MyTrips,
                ViewModelType = typeof(MyTripsViewModel),
                IsEnabled = true
            });

            MenuItems.Add(new Models.MenuItem
            {
                Title = "Find Flights",
                MenuItemType = MenuItemType.FindFlights,
                ViewModelType = typeof(FindFlightsViewModel),
                IsEnabled = true
            });

            MenuItems.Add(new Models.MenuItem
            {
                Title = "Contact",
                MenuItemType = MenuItemType.Contact,
                ViewModelType = typeof(BotViewModel),
                IsEnabled = true
            });

            MenuItems.Add(new Models.MenuItem
            {
                Title = "Profile",
                MenuItemType = MenuItemType.Profile,
                ViewModelType = typeof(ProfileViewModel),
                IsEnabled = true
            });

            MenuItems.Add(new Models.MenuItem
            {
                Title = "Solo Service",
                MenuItemType = MenuItemType.Notification,
                ViewModelType = typeof(SoloServiceViewModel),
                IsEnabled = true
            });
        }

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

        private async void OnSelectItem(Models.MenuItem item)
        {
            if (item.IsEnabled)
            {
                await NavigationService.NavigateToAsync(item.ViewModelType, item);
            }
        }

        private async void OnLogout()
        {
#if !ENABLE_TEST_CLOUD
			await _nativePushNotificationService.RemoveRegistrations();
#endif
            await _authenticationService.LogoutAsync();
            await NavigationService.NavigateToAsync<LoginViewModel>();
        }
    }
}