using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Notifications
{
    public interface INativePushNotificationService
    {
        Task RegisterNotificationTag(string tag);

        Task RemoveRegistrations();
    }
}
