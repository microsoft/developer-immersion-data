using Xamarin.Forms;

namespace ContosoAir.Clients.Views
{
    public partial class ProfileView : ContentPage
    {
        public ProfileView()
        {
            InitializeComponent();

            if (Device.OS != TargetPlatform.iOS)
            {
                ToolbarItems.Remove(LogoutToolbarItem);
            }
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (Device.OS == TargetPlatform.iOS)
                SetiOSBarBackgroundColor(Color.FromHex("#580e28"));
            else
                SetBarBackgroundColor(Color.FromHex("#580e28"));
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();

            if(Device.OS == TargetPlatform.iOS)
                SetiOSBarBackgroundColor(Color.Transparent);
            else
                SetBarBackgroundColor(Color.Transparent);
        }

        private void SetBarBackgroundColor(Color color)
        {
            var mainPage = App.Current.MainPage as MainView;

            if (mainPage == null)
            {
                return;
            }

            var navigationPage = mainPage.Detail as NavigationPage;

            if (navigationPage != null)
            {
                navigationPage.BarBackgroundColor = color;
            }
        }
        
        private void SetiOSBarBackgroundColor(Color color)
        {
            var mainPage = App.Current.MainPage as iOSMainView;

            if (mainPage == null)
            {
                return;
            }

            var navigationPage = mainPage.CurrentPage as NavigationPage;

            if (navigationPage != null)
            {
                navigationPage.BarBackgroundColor = color;
            }
        }
    }
}