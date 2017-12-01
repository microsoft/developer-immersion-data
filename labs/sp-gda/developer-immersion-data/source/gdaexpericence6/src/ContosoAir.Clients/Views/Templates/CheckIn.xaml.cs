using ContosoAir.Clients.Models;
using Xamarin.Forms;

namespace ContosoAir.Clients.Views
{
    public partial class CheckIn : ContentView
    {
        public static readonly BindableProperty CheckInDealProperty =
              BindableProperty.Create("CheckInDeal", typeof(Deal), typeof(CheckIn), null);

        public Deal CheckInDeal
        {
            get { return (Deal)GetValue(CheckInDealProperty); }
            set { SetValue(CheckInDealProperty, value); }
        }

        public static readonly BindableProperty IsDelayedProperty =
              BindableProperty.Create("IsDelayed", typeof(bool), typeof(CheckIn), false);

        public bool IsDelayed
        {
            get { return (bool)GetValue(IsDelayedProperty); }
            set { SetValue(IsDelayedProperty, value); }
        }

        public CheckIn()
        {
            InitializeComponent();
        }
    }
}
