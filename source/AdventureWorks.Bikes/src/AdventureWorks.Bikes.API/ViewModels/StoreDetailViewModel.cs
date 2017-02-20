using AdventureWorks.Bikes.Infrastructure.DocumentDB.Model;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class StoreDetailViewModel
    {
        public StoreDetailViewModel(DBStore store, double distance = 0)
        {
            if (store != null)
            {
                StoreId = store.Id;
                Name = store.Name;
                Description = store.Description;
                Address = store.Address;
                City = store.City;
                State = store.State;
                Country = store.Country;
                Distance = distance;
            }
        }

        public string StoreId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Country { get; set; }

        public double Distance { get; set; }
    }
}
