using AdventureWorks.Bikes.Infrastructure.SearchService.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class FacetsProductListViewModel
    {
        public IEnumerable<ProductListViewModel> productList { get; set; }

        public IEnumerable<PriceFacetViewModel> priceFacetList { get; set; }
    }

    public class PriceFacetViewModel
    {
        public PriceFacetViewModel(Originalprice p)
        {
            Price = p.value;
            ProductCount = p.count;
        }
        public int Price { get; set; }

        public int ProductCount { get; set; }
    }
}
