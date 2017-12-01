using ContosoAir.Clients.Models;
using Xamarin.Forms;

namespace ContosoAir.Clients.Controls
{
    public partial class FlightControl : ContentView
    {
        public static readonly BindableProperty FlightProperty =
            BindableProperty.Create("Flight", typeof(Flight), typeof(FlightControl), null);

        public Flight Flight
        {
            get { return (Flight)GetValue(FlightProperty); }
            set { SetValue(FlightProperty, value); }
        }

        public FlightControl()
        {
            InitializeComponent();
        }
    }
}