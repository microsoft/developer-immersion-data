using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.DataServices.GateChange;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.Services.Notifications;
using ContosoAir.Clients.ViewModels.Base;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;

namespace ContosoAir.Clients.ViewModels
{
    public class GateChangeViewModel : ViewModelBase
    {

        private readonly IGateChangeService _gateChangeService;
        private readonly IAuthenticationService _authenticationService;
        public FlightDelayDetails _flightDelayDetails = new FlightDelayDetails();
        public FlightDelayDetails flightDelayDetails = new FlightDelayDetails();
        public Profile Profile = new Profile();

        public GateChangeViewModel(IGateChangeService gateChangeService, IAuthenticationService authenticationService)
        {
            _gateChangeService = gateChangeService;
            _authenticationService = authenticationService;
        }

        public FlightDelayDetails FlightDelayDetails
        {
            get
            {
                return _flightDelayDetails;
            }
            set
            {
                _flightDelayDetails = value;
                RaisePropertyChanged(() => FlightDelayDetails);
            }
        }

        public override async Task InitializeAsync(object navigationData)
        {
            try
            {
                FlightDelayDetails flight_delay_details = new FlightDelayDetails();
                flight_delay_details.LodingIcon = false;
                FlightDelayDetails = flight_delay_details;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading solo service data: {ex}");
            }
        }

        public string FormatDateTime(string DateTime)
        {
            string date = DateTime.Split('T')[0];
            string time = DateTime.Split('T')[1];
            int year = Convert.ToInt32(date.Split('-')[0]);
            int month = Convert.ToInt32(date.Split('-')[1]);
            int day = Convert.ToInt32(date.Split('-')[2]);
            int hour = Convert.ToInt32(time.Split(':')[0]);
            int min = Convert.ToInt32(time.Split(':')[1]);
            int sec = Convert.ToInt32(time.Split(':')[2].Substring(0, time.Split(':')[2].Length - 1));
            DateTime Date_Time = new DateTime(year, month, day, hour, min, sec);
            return Date_Time.ToString("F");
        }
    }
}
