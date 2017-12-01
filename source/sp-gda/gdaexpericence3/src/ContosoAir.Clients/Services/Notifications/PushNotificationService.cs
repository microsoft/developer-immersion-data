using ContosoAir.Clients.DataServices.Base;
using ContosoAir.Clients.DataServices.Trips;
using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.Services.Navigation;
using ContosoAir.Clients.ViewModels;
using System;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Notifications
{
    public class PushNotificationService : IPushNotificationService
    {
        private readonly INavigationService _navigationService;
        private readonly IRequestProvider _requestProvider;
        private readonly ITripsService _tripsService;

        public PushNotificationService(
            INavigationService navigationService,
            IRequestProvider requestProvider,
            ITripsService tripsService)
        {
            _navigationService = navigationService;
            _requestProvider = requestProvider;
            _tripsService = tripsService;
        }

        public async Task HandleNotificationActivationAsync(NotificationType type)
        {
            switch (type)
            {
                case NotificationType.CheckInAvailable:
                    await _tripsService.SetCurrentFlightStatusAsync(FlightStatus.CheckInAvailable);
                    await _navigationService.NavigateToAsync<MyTripsViewModel>();
                    await _navigationService.RemoveLastFromBackStackAsync();
                    break;
                case NotificationType.DelayedFlight:
                    await _tripsService.SetCurrentFlightStatusAsync(FlightStatus.Delayed);
                    await _navigationService.NavigateToAsync<MyTripsViewModel>();
                    await _navigationService.RemoveLastFromBackStackAsync();
                    break;
                case NotificationType.GiveFeedback:
                    await _navigationService.NavigateToAsync<FeedbackViewModel>();
                    break;
            }
        }

        public NotificationType GetNotificationTypeFromData(string data)
        {
            NotificationType type = NotificationType.None;

            try
            {
                type = (NotificationType)Enum.Parse(typeof(NotificationType), data);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error obtaining notification type from push notification data: {ex}");
            }

            return type;
        }

        public async Task SendNotification(NotificationType type, TimeSpan delay)
        {
            try
            {
                await Task.Delay(delay);

                var builder = new UriBuilder(Settings.ContosoAirEndpoint);
                builder.Path = $"api/notifications";
                var uri = builder.ToString();

                var notification = new Notification { Tag = Settings.UserId, Type = type };

                await _requestProvider.PostAsync<Notification>(uri, notification);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error sending push notification: {ex}");
            }
        }
    }
}