using ContosoAir.Clients.DataServices.Trips;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.ViewModels.Base;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class MyTripsViewModel : ViewModelBase
    {
        private readonly ITripsService _tripsService;

        private ObservableCollection<Deal> _trips;
        private CurrentDealStatusViewModel _currentDealStatusViewModel;

        public MyTripsViewModel(
            ITripsService tripsService,
            CurrentDealStatusViewModel currentDealStatusViewModel)
        {
            _tripsService = tripsService;
            _currentDealStatusViewModel = currentDealStatusViewModel;
        }

        public ObservableCollection<Deal> Trips
        {
            get { return _trips; }
            set
            {
                _trips = value;
                RaisePropertyChanged(() => Trips);
            }
        }

        public CurrentDealStatusViewModel CurrentDealStatusViewModel
        {
            get { return _currentDealStatusViewModel; }
            set
            {
                _currentDealStatusViewModel = value;
                RaisePropertyChanged(() => CurrentDealStatusViewModel);
            }
        }

        public ICommand RefreshCommand => new Command(RefreshAsync, () =>
        {
            return !IsBusy;
        });

        public override async Task InitializeAsync(object navigationData)
        {
            await LoadDeals();
            await CurrentDealStatusViewModel.InitializeAsync(navigationData);
        }

        private async void RefreshAsync()
        {
            await LoadDeals();
        }

        private async Task LoadDeals()
        {
            try
            {
                IsBusy = true;

                var deals = await _tripsService.GetTripsAsync();

                if (deals != null)
                {
                    Trips = new ObservableCollection<Deal>(deals);

                    CurrentDealStatusViewModel.CheckInDeal = Trips
                        .FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading trips data: {ex}");
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}
