using AdventureWorks.Bikes.Infrastructure.CosmosDB.Model;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class StoreListViewModel
    {
        public StoreListViewModel(DBStore store)
        {
            if (store != null)
            {
                StoreId = store.Id;
                Name = store.Name;
            }
        }

        public string StoreId { get; set; }

        public string Name { get; set; }
    }
}
