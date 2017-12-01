using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.Services.Notifications;
using Microsoft.WindowsAzure.Messaging;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Windows.Networking.PushNotifications;

namespace ContosoAir.Clients.UWP.Services.Notifications
{
    public class NativePushNotificationService : INativePushNotificationService
    {
        private TaskCompletionSource<string> _registrationTaskCompletionSource;
        private NotificationHub _hub;
        private PushNotificationChannel _channel;

        public async Task InitNotificationsAsync()
        {
            try { 
                _registrationTaskCompletionSource = new TaskCompletionSource<string>();
                _channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
                _hub = new NotificationHub(
                    Settings.NotificationHubName,
                    Settings.NotificationHubConnectionString);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Unable to initialize GCMClient" + ex);
            }
        }

        public async Task RegisterNotificationTag(string tag)
        {
            string[] tags = null;

            if (!string.IsNullOrEmpty(tag))
            {
                tags = new[] { tag };
            }

            Registration result = await _hub?.RegisterNativeAsync(_channel.Uri, tags);

            // Displays the registration ID so you know it was successful
            if (result?.RegistrationId != null)
            {
                _registrationTaskCompletionSource.TrySetResult(result.RegistrationId);

                Debug.WriteLine("Registration successful: " + result.RegistrationId);
            }
        }

        public async Task RemoveRegistrations()
        {
            await _hub?.UnregisterAllAsync(_channel.Uri);
        }
    }
}
