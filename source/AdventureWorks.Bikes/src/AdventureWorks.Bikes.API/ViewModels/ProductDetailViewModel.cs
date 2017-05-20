
using AdventureWorks.Bikes.Infrastructure.CosmosDB.Model;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class ProductDetailViewModel
    {
        public ProductDetailViewModel(DBProduct product)
        {
            if (product != null)
            {
                ProductId = product.Id;
                Name = product.Name;
                OriginalPrice = product.OriginalPrice;
                FinalPrice = product.OriginalPrice * ((double)product.Discount / 100);
                Discount = product.Discount;
                RemainingUnits = product.RemainingUnits;
                Description = product.Description;
                RemainingUnits = product.RemainingUnits;
                StoreId = product.StoreId;
                StoreName = "XTZ Bike Shop"; // TODO: Get the store´s name
            }
        }
        public string ProductId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string HighlightedDescription { get; set; }

        public string Comments { get; set; }

        public double OriginalPrice { get; set; }

        public int Discount { get; set; }

        public double FinalPrice { get; set; }

        public int RemainingUnits { get; set; }

        public string StoreId { get; set; }

        public string StoreName { get; set; }
    }
}

