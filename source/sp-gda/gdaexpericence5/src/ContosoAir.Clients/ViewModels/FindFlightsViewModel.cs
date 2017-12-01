using ContosoAir.Clients.DataServices.Deals;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.ViewModels.Base;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;

namespace ContosoAir.Clients.ViewModels
{
    public class FindFlightsViewModel : ViewModelBase
    {
        private IDealsService _dealsService;

        private ObservableCollection<Deal> _myDeals;

        public FindFlightsViewModel(IDealsService dealsService)
        {
            _dealsService = dealsService;
        }

        public ObservableCollection<Deal> MyDeals
        {
            get { return _myDeals; }
            set
            {
                _myDeals = value;
                RaisePropertyChanged(() => MyDeals);
            }
        }

        public ICommand RefreshCommand => new Command(RefreshAsync, () =>
        {
            return !IsBusy;
        });

        public override async Task InitializeAsync(object navigationData)
        {
            await LoadDeals();
        }

        private async void RefreshAsync()
        {
            await LoadDeals();
        }

        private async Task LoadDeals()
        {
            IsBusy = true;

            try
            {
                var deals = await _dealsService.GetDealsAsync();

                if (deals != null)
                {
                    MyDeals = new ObservableCollection<Deal>(deals);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading flighs: {ex}");
            }

            IsBusy = false;
        }
    }
}
