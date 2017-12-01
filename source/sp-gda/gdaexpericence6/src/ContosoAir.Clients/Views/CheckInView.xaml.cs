using Xamarin.Forms;

namespace ContosoAir.Clients.Views
{
    public partial class CheckInView : ContentPage
    {
        public CheckInView()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            CheckInScrollView.Scrolled += OnScrolled;

            if (Device.OS == TargetPlatform.iOS)
                SetiOSBarBackgroundColor(Color.FromHex("#6B9FCD"));
            else
                SetBarBackgroundColor(Color.FromHex("#6B9FCD"));
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();

            CheckInScrollView.Scrolled -= OnScrolled;

            if (Device.OS == TargetPlatform.iOS)
                SetiOSBarBackgroundColor(Color.Transparent);
            else
                SetBarBackgroundColor(Color.Transparent);
        }

        private void OnScrolled(object sender, ScrolledEventArgs e)
        {
            var imageHeight = CityImage.Height;
            var scrollRegion = CheckInPanel.Height - imageHeight;
            var parallexRegion = imageHeight;

            if (scrollRegion > 0)
            {
                CityImage.TranslationY = 
                    CheckInScrollView.ScrollY - parallexRegion 
                    * (CheckInScrollView.ScrollY / scrollRegion);
            }
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