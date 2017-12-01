using ContosoAir.Clients.Models;
using System;

using Xamarin.Forms;

namespace ContosoAir.Clients.Controls
{
    public partial class DealControl : ContentView
    {
        public static readonly BindableProperty DealProperty =
            BindableProperty.Create("Deal", typeof(Deal), typeof(DealControl), null);

        public Deal Deal
        {
            get { return (Deal)GetValue(DealProperty); }
            set { SetValue(DealProperty, value); }
        }

        public static readonly BindableProperty ShowPriceProperty =
            BindableProperty.Create("ShowPrice", typeof(bool), typeof(DealControl), true);

        public bool ShowPrice
        {
            get { return (bool)GetValue(ShowPriceProperty); }
            set { SetValue(ShowPriceProperty, value); }
        }

        public static readonly BindableProperty DepartDateProperty =
            BindableProperty.Create("DepartDate", typeof(DateTime), typeof(DealControl), default(DateTime));

        public DateTime DepartDate
        {
            get { return (DateTime)GetValue(DepartDateProperty); }
            set { SetValue(DepartDateProperty, value); }
        }

        public DealControl()
        {
            InitializeComponent();

            this.DepartDate = GlobalSettings.MyTripsDepartDate;

            var tapGestureRecognizer = new TapGestureRecognizer();
            GestureRecognizers.Add(tapGestureRecognizer);

            tapGestureRecognizer.Tapped += AnimateCardClick;
        }

        private async void AnimateCardClick(object sender, EventArgs e)
        {
            var contentView = (ContentView)sender;

            if (Device.OS == TargetPlatform.Windows)
            {
                var item = (Frame)contentView.Content;
                await item.ScaleTo(0.95, 50, Easing.CubicOut);
                await item.ScaleTo(1, 50, Easing.CubicIn);
            }
            else
            {
                var item = (Grid)contentView.Content;
                await item.ScaleTo(0.95, 50, Easing.CubicOut);
                await item.ScaleTo(1, 50, Easing.CubicIn);
            }
        }
    }
}
