using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.DataServices.SoloServiceProviders;
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
    public class SoloServiceViewModel : ViewModelBase
    {
        public SoloServiceProviders _soloServiceProvidersData;

        private readonly ISoloServiceProvider _soloServiceProvider;

        IEnumerable<SoloService> soloService = null;

        IEnumerable<SoloService> soloServicedp = null;        

        public SoloServiceViewModel(ISoloServiceProvider soloServiceProvider)
        {
            _soloServiceProvider = soloServiceProvider;
        }

        public SoloServiceProviders SoloServiceProviders
        {
            get
            {
                return _soloServiceProvidersData;
            }
            set
            {
                _soloServiceProvidersData = value;
                RaisePropertyChanged(() => SoloServiceProviders);
            }
        }        

        public override async Task InitializeAsync(object navigationData)
        {
            try
            {

                SoloServiceProviders ssp = new SoloServiceProviders();
                ssp.ShowHideIcon = true;
                SoloServiceProviders = ssp;
                var _soloService = await _soloServiceProvider.GetSoloServiceProviderAsync();
                DateTime date = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day + 2);

                if (_soloService != null)
                {
                    soloService = _soloService;
                    int index = 0;
                    SoloServiceProviders SoloService = new SoloServiceProviders();
                    SoloService.Source_SoloService_Score = 0;
                    SoloService.Dest_SoloService_Score = 0;
                    foreach (SoloService SS in soloService)
                    {
                        if (index == 0)
                        {
                            SoloService.Source_SoloService_AirlineName = "Contoso Airline";
                            SoloService.Source_SoloService_End_Date = SS.End_Date;
                            SoloService.Source_SoloService_Code = SS.From_Code + "-" + SS.To_Code;
                            SoloService.Source_SoloService_Name = SS.First_Name.ToString() + " " + SS.Last_Name.ToString();
                            SoloService.Source_SoloService_Address = SS.Address + ", " + SS.City + " " + SS.State + ", " + SS.Country + " - " + SS.Zip;
                            SoloService.Source_SoloService_City = SS.City;
                            SoloService.Source_SoloService_State = SS.State;
                            SoloService.Source_SoloService_Country = SS.Country;
                            SoloService.Source_SoloService_Zip = SS.Zip;
                            SoloService.Source_SoloService_Phone_1 = SS.Phone1;
                            SoloService.Source_SoloService_Phone_2 = SS.Phone2;
                            SoloService.Source_SoloService_Photo = SS.Photo;
                            SoloService.Source_SoloService_Reviews = SS.Reviews;                           
                            SoloService.Source_SoloService_End_Date = date.ToString("dddd, dd MMMM yyyy");
                            SoloService.Source_SoloService_Code = "BCN - SEA";
                        }
                        else
                        {
                            SoloService.Dest_SoloService_AirlineName = SS.Airline_Name;
                            SoloService.Dest_SoloService_Name = SS.First_Name + " " + SS.Last_Name;
                            SoloService.Dest_SoloService_Address = SS.Address + ", " + SS.City + " " + SS.State + ", " + SS.Country + " - " + SS.Zip;
                            SoloService.Dest_SoloService_City = SS.City;
                            SoloService.Dest_SoloService_State = SS.State;
                            SoloService.Dest_SoloService_Country = SS.Country;
                            SoloService.Dest_SoloService_Zip = SS.Zip;
                            SoloService.Dest_SoloService_Phone_1 = SS.Phone1;
                            SoloService.Dest_SoloService_Phone_2 = SS.Phone2;
                            SoloService.Dest_SoloService_Photo = SS.Photo;
                            SoloService.Dest_SoloService_Reviews = SS.Reviews;                           
                            SoloService.Dest_SoloService_End_Date = date.ToString("dddd, dd MMMM yyyy");
                            SoloService.Dest_SoloService_Code = "BCN - SEA";
                        }
                        index++;
                    }
                 
                    SoloService.ShowHideIcon = false;
                    SoloServiceProviders = SoloService;

                }                
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading solo service data: {ex}");
            }

        }
    }
}
