using ContosoAir.Clients.ViewModels.Base;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class ThankViewModel : ViewModelBase
    {
        public ICommand ThanksCommand => new Command(ThanksAsync);

        private async void ThanksAsync()
        {
            await NavigationService.RemoveLastFromBackStackAsync();
            await NavigationService.NavigateToAsync<MainViewModel>();
        }
    }
}
