using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.Services.Notifications;
using ContosoAir.Clients.ViewModels.Base;
using System;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private MenuViewModel _menuViewModel;
        private readonly INativePushNotificationService _nativePushNotificationService;
        private readonly IPushNotificationService _pushNotificationService;

        public MainViewModel(
            MenuViewModel menuViewModel, 
            INativePushNotificationService nativePushNotificationService, 
            IPushNotificationService pushNotificationService)
        {
            _menuViewModel = menuViewModel;
            _nativePushNotificationService = nativePushNotificationService;
            _pushNotificationService = pushNotificationService;

            MessagingCenter.Subscribe<ViewModelBase, NotificationType>(this, MessengerKeys.NotificationRequest, async (v, t) => { await OnNotificationRequestAsync(t); });
        }

        public MenuViewModel MenuViewModel
        {
            get
            {
                return _menuViewModel;
            }

            set
            {
                _menuViewModel = value;
                RaisePropertyChanged(() => MenuViewModel);
            }
        }

        public override Task InitializeAsync(object navigationData)
        {
            return Task.WhenAll
                (
                    _nativePushNotificationService.RegisterNotificationTag(Settings.UserId),
                    _menuViewModel.InitializeAsync(navigationData),
                    NavigationService.NavigateToAsync<FindFlightsViewModel>()
                );
        }

        private async Task OnNotificationRequestAsync(NotificationType type)
        {
            switch (type)
            {
                case NotificationType.DelayedFlight:
                    var delayTs = TimeSpan.FromSeconds(Settings.DelayedTime);
                    await _pushNotificationService.SendNotification(NotificationType.DelayedFlight, delayTs);
                    break;
                case NotificationType.GiveFeedback:
                    var feedbackTs = TimeSpan.FromSeconds(Settings.FeedbackTime);
                    await _pushNotificationService.SendNotification(NotificationType.GiveFeedback, feedbackTs);
                    break;
                default:
                    break;
            }
        }

        public override void Dispose()
        {
            base.Dispose();

            MessagingCenter.Unsubscribe<ViewModelBase, NotificationType>(this, MessengerKeys.NotificationRequest);
        }
    }
}