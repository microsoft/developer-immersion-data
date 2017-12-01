using ContosoAir.Clients.Models;
using System;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Notifications
{
    public interface IPushNotificationService
    {
        NotificationType GetNotificationTypeFromData(string data);

        Task HandleNotificationActivationAsync(NotificationType type);

        Task SendNotification(NotificationType type, TimeSpan delay);
    }
}
