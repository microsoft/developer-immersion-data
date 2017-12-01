using ContosoAir.Clients.DataServices.Trips;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.ViewModels.Base;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class CurrentDealStatusViewModel : ViewModelBase
    {
        private readonly ITripsService _tripsService;

        private Deal _checkInDeal;
        private bool _checkInAvailable;
        private bool _checkInDone;
        private bool _isDelayed;

        public CurrentDealStatusViewModel(ITripsService tripsService)
        {
            _tripsService = tripsService;

            MessagingCenter.Subscribe<ObservableCollection<Flight>>(this, MessengerKeys.CheckInDone, OnCheckinDone);
        }

        public Deal CheckInDeal
        {
            get { return _checkInDeal; }
            set
            {
                _checkInDeal = value;
                RaisePropertyChanged(() => CheckInDeal);
            }
        }

        public bool IsDelayed
        {
            get { return _isDelayed; }
            set
            {
                _isDelayed = value;
                RaisePropertyChanged(() => IsDelayed);
            }
        }

        public bool CheckInAvailable
        {
            get { return _checkInAvailable; }
            set
            {
                _checkInAvailable = value;
                RaisePropertyChanged(() => CheckInAvailable);
            }
        }

        public bool CheckInDone
        {
            get { return _checkInDone; }
            set
            {
                _checkInDone = value;
                RaisePropertyChanged(() => CheckInDone);
            }
        }

        public ICommand CheckInCommand => new Command(CheckInAsync);

        public override async Task InitializeAsync(object navigationData)
        {
            IsDelayed = true;

            await HandleCurrentTripStatusAsync();
        }

        private async void CheckInAsync(object obj)
        {
            await NavigationService.NavigateToAsync<CheckInViewModel>(_checkInDeal);
        }

        private async void OnCheckinDone(ObservableCollection<Flight> flights)
        {
            if (flights == null)
                return;

            await Task.Delay(500);

            CheckInAvailable = false;
            IsDelayed = false;
            CheckInDone = true;
        }

        private async Task HandleCurrentTripStatusAsync()
        {
            FlightStatus currentStatus = await _tripsService.GetCurrentFlightStatusAsync();

            switch (currentStatus)
            {
                case FlightStatus.CheckInAvailable:
                    CheckInDone = false;
                    CheckInAvailable = true;
                    break;
                case FlightStatus.AlreadyChecked:
                    CheckInDone = true;
                    CheckInAvailable = false;
                    IsDelayed = false;
                    break;
                case FlightStatus.Delayed:
                    CheckInAvailable = false;
                    CheckInDone = true;
                    IsDelayed = true;
                    break;
            }
        }
    }
}
