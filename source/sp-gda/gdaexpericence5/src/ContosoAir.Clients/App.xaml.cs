using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.Services.Navigation;
using ContosoAir.Clients.ViewModels.Base;
using Microsoft.Identity.Client;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace ContosoAir.Clients
{
    public partial class App : Application
    {
        public static PublicClientApplication AuthenticationClient { get; set; }

        public App()
        {
            InitializeComponent();

            App.AuthenticationClient =
                new PublicClientApplication($"{GlobalSettings.Authority}{Settings.Tenant}", Settings.ClientId);

            if (Device.OS == TargetPlatform.Windows)
            {
                InitNavigation();
            }
        }

        protected async override void OnStart()
        {
            base.OnStart();

            if (Device.OS != TargetPlatform.Windows)
            {
                await InitNavigation();
            }
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }

        private Task InitNavigation()
        {
            var navigationService = ViewModelLocator.Instance.Resolve<INavigationService>();
            return navigationService.InitializeAsync();
        }
    }
}
