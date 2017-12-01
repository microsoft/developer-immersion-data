using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.ViewModels.Base;
using System;
using System.Diagnostics;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class BotViewModel : ViewModelBase
    {
        const string Skype = "Skype";        

        public ICommand OpenBotCommand
        {
            get { return new Command(() => OpenBot()); }
        }

        public ICommand FeedbackCommand
        {
            get { return new Command(() => OpenFeedback()); }
        }

        private async void OpenBot()
        {
            var bots = new[] { Skype };

            try
            {
                var selectedBot =
                    await DialogService.SelectActionAsync("Please, select which messenger app would you like to use", "Bot selection", bots);

                switch (selectedBot)
                {
                    case Skype:
                        Device.OpenUri(new Uri($"skype:{Settings.SkypeBotAccount}?chat"));
                        break;                    
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in: {ex}");
                await DialogService.ShowAlertAsync("Unable to launch Contoso Air Skype Bot.", "Error", "Ok");
            }
        }

        private async void OpenFeedback()
        {
            await NavigationService.NavigateToAsync<FeedbackViewModel>();
        }
    }
}