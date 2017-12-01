using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.DataServices.Trips;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.ViewModels.Base;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class ConfirmationViewModel : ViewModelBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ITripsService _tripsService;

        private ObservableCollection<Flight> _flights;
        private Profile _profile;
        private string _fromName;
        private string _fromCode;
        private string _toName;
        private string _toCode;

        public ConfirmationViewModel(
            IAuthenticationService authenticationService,
            ITripsService tripsService)
        {
            _authenticationService = authenticationService;
            _tripsService = tripsService;
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

        public Profile Profile
        {
            get { return _profile; }
            set
            {
                _profile = value;
                RaisePropertyChanged(() => Profile);
            }
        }

        public string FromName
        {
            get { return _fromName; }
            set
            {
                _fromName = value;
                RaisePropertyChanged(() => FromName);
            }
        }

        public string FromCode
        {
            get { return _fromCode; }
            set
            {
                _fromCode = value;
                RaisePropertyChanged(() => FromCode);
            }
        }

        public string ToName
        {
            get { return _toName; }
            set
            {
                _toName = value;
                RaisePropertyChanged(() => ToName);
            }
        }

        public string ToCode
        {
            get { return _toCode; }
            set
            {
                _toCode = value;
                RaisePropertyChanged(() => ToCode);
            }
        }

        public ICommand DoneCommand => new Command(DoneAsync);

        public override async Task InitializeAsync(object navigationData)
        {
            if (navigationData as ObservableCollection<Flight> != null)
            {
                var flights = (ObservableCollection<Flight>)navigationData;
                Profile = await _authenticationService.GetProfileAsync();

                foreach (var flight in flights)
                {
                    flight.PassengerName = Profile.Name;
                }

                Flights = flights;
                var departure = Flights.FirstOrDefault();

                if (departure != null)
                {
                    FromName = departure.FromName;
                    FromCode = departure.FromCode;
                }

                var arrival = Flights.LastOrDefault();

                if (arrival != null)
                {
                    ToName = arrival.ToName;
                    ToCode = arrival.ToCode;
                }
            }
        }

        private async void DoneAsync()
        {
            MessagingCenter.Send(Flights, MessengerKeys.CheckInDone);
            MessagingCenter.Send<ViewModelBase, NotificationType>(this, MessengerKeys.NotificationRequest, NotificationType.DelayedFlight);
            MessagingCenter.Send<ViewModelBase, NotificationType>(this, MessengerKeys.NotificationRequest, NotificationType.GiveFeedback);

            await _tripsService.SetCurrentFlightStatusAsync(FlightStatus.AlreadyChecked);
            await NavigationService.RemoveLastFromBackStackAsync();
            await NavigationService.NavigateBackAsync();
        }
    }
}