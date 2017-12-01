using System.Threading.Tasks;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.ViewModels.Base;
using System.Windows.Input;
using Xamarin.Forms;
using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.DataServices.Checkin;
using System.Collections.ObjectModel;
using ContosoAir.Clients.Helpers;

namespace ContosoAir.Clients.ViewModels
{
    public class CheckInViewModel : ViewModelBase
    {
        private int _index;
        private ObservableCollection<Flight> _flights;
        private Flight _flight;
        private Profile _profile;
        private string _step;
        private string _count;

        private IAuthenticationService _authenticationService;
        private ICheckinService _checkinService;

        public CheckInViewModel(
            IAuthenticationService authenticationService,
            ICheckinService checkinService)
        {
            _authenticationService = authenticationService;
            _checkinService = checkinService;

            _index = 0;
        }

        public ObservableCollection<Flight> Flights
        {
            get { return _flights; }
            set
            {
                _flights = value;
                RaisePropertyChanged(() => Flights);
            }
        }

        public Flight Flight
        {
            get { return _flight; }
            set
            {
                _flight = value;
                RaisePropertyChanged(() => Flight);
            }
        }

        public Profile Profile
        {
            get { return _profile; }
            set
            {
                _profile = value;
                RaisePropertyChanged(() => Profile);
            }
        }

        public string Step
        {
            get { return _step; }
            set
            {
                _step = value;
                RaisePropertyChanged(() => Step);
            }
        }

        public string Count
        {
            get { return _count; }
            set
            {
                _count = value;
                RaisePropertyChanged(() => Count);
            }
        }

        public ICommand CheckInCommand => new Command(async () => await CheckInInAsync());

        public override async Task InitializeAsync(object navigationData)
        {
            IsBusy = true;

            Profile = await _authenticationService.GetProfileAsync();
            Flights = await _checkinService.GetCheckInFlightsAsync();
            GetNextDeal(_index);

            IsBusy = false;
        }

        private async Task CheckInInAsync()
        {
            if (_index == Flights.Count)
            {
                if (Device.OS != TargetPlatform.iOS)
                {
                    await NavigationService.RemoveLastFromBackStackAsync();
                }

                await NavigationService.NavigateToAsync<ConfirmationViewModel>(Flights);
            }

            if (_index < Flights.Count)
            {
                IsBusy = true;

                await Task.Delay(500);
                GetNextDeal(_index);

                IsBusy = false;
            }
        }

        private void GetNextDeal(int index)
        {
            Step = NumberHelper.GetNumberName(_index);
            Count = NumberHelper.GetNumberName(Flights.Count - 1);
            Flight = Flights[index];

            _index++;
        }
    }
}