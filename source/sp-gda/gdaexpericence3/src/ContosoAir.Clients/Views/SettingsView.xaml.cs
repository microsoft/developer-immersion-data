using Xamarin.Forms;

namespace ContosoAir.Clients.Views
{
    public partial class SettingsView : ContentPage
    {
        public SettingsView()
        {
            NavigationPage.SetHasNavigationBar(this, false);
            InitializeComponent();
        }
    }
}