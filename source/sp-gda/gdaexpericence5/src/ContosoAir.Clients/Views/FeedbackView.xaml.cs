using ContosoAir.Clients.Models;
using ContosoAir.Clients.DataServices.Feedback;
using ContosoAir.Clients.Helpers;
using ContosoAir.Clients.ViewModels;
using System;
using System.IO;
using System.Net.Http;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using Newtonsoft.Json;
using System.Diagnostics;
using Newtonsoft.Json.Linq;
using ContosoAir.Clients.Services.Dialog;
using ContosoAir.Clients.ViewModels.Base;


namespace ContosoAir.Clients.Views
{
    public partial class FeedbackView : ContentPage
    {
        
        public FeedbackView()
        {
            
            InitializeComponent();


            try
            {
                //Hit the azure function url which give all Flight Data
                using (var httpClient = new HttpClient())
                {
                    //Hit the azure function url
                    var response = httpClient.GetStringAsync(new Uri(Settings.GetFlightDetailsUrl)).Result;
                    List<FlightData> list = JsonConvert.DeserializeObject<List<FlightData>>(response);
                    int abc = list.Count;

                    for (int i = 0; i < list.Count; i++)
                    {
                        //Dynamically append the flight Id as picker items
                        FlightDataPicker.Items.Add(list[i].flightId + " ---- " + list[i].airlineName + " From " + list[i].source + " To " + list[i].destination);

                        //Select first value as default selected using selectIndex = 0
                        FlightDataPicker.SelectedIndex = 0;
                    }
                }
            }
            catch (Exception e)
            {
                DisplayAlert("Error", "Please check your Select data method url or check your azure function", "Ok");
            }



        }

        public static string name = "";

        //Method for give selected flight id value
        public void FlightDataPicker_SelectedIndexChanged(object sender, EventArgs e)
        {
            //give the selected flight id before submit button click
            name = FlightDataPicker.Items[FlightDataPicker.SelectedIndex];
        }

    }

}
