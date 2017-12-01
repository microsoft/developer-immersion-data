using ContosoAir.Clients.Models;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.Views
{
    public partial class CheckInAvailable : ContentView
    {
        public static readonly BindableProperty CheckInDealProperty =
              BindableProperty.Create("CheckInDeal", typeof(Deal), typeof(CheckInAvailable), null);

        public Deal CheckInDeal
        {
            get { return (Deal)GetValue(CheckInDealProperty); }
            set { SetValue(CheckInDealProperty, value); }
        }

        public static readonly BindableProperty CheckInCommandProperty =
              BindableProperty.Create("CheckInCommand", typeof(ICommand), typeof(CheckInAvailable), default(ICommand));

        public ICommand CheckInCommand
        {
            get { return (ICommand)GetValue(CheckInCommandProperty); }
            set { SetValue(CheckInCommandProperty, value); }
        }

        public CheckInAvailable()
        {
            InitializeComponent();
        }
    }
}