using ContosoAir.Clients.Models;
using ContosoAir.Clients.DataServices.Feedback;
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

namespace ContosoAir.Clients.Views
{
    public partial class FeedbackView : ContentPage
    {
        public FeedbackView()
        {
            
            InitializeComponent();
            

            using (var httpClient = new HttpClient())
            {

                var response = httpClient.GetStringAsync(new Uri("https://c2crohitlab5poc.azurewebsites.net/api/AzureFunctionForSelectFlightID?code=X2JH6/Xee6IXigA5/CEDi18t5PCykmB0f0n1/DzBj3qnbTCtkSdIeA==")).Result;
                List<FlightData> list = JsonConvert.DeserializeObject<List<FlightData>>(response);
                int abc = list.Count;

                for (int i = 0; i < list.Count; i++)
                {
                    FlightDataPicker.Items.Add(list[i].flightId);
                    FlightDataPicker.SelectedIndex = 0;
                }
            }

        }

        public static string name = "";

        public void FlightDataPicker_SelectedIndexChanged(object sender, EventArgs e)
        {
            name = FlightDataPicker.Items[FlightDataPicker.SelectedIndex];
            //DisplayAlert(name, "Flight ID Selected", "Ok");
        }

    }

}
