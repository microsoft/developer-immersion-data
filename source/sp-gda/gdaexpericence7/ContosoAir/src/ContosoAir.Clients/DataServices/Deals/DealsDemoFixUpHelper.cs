using ContosoAir.Clients.Models;
using System.Collections.Generic;
using System.Linq;
using System;

namespace ContosoAir.Clients.DataServices.Deals
{
    public static class DealsDemoFixUpHelper
    {
        internal static IEnumerable<Deal> FixData(IEnumerable<Deal> deals)
        {
            var fixedDeals = RemoveDuplicates(deals);
            fixedDeals = RemoveTypos(fixedDeals);
            fixedDeals = AddExtraDeals(fixedDeals);
            fixedDeals = FixPrices(fixedDeals);

            return fixedDeals;
        }

        private static IEnumerable<Deal> RemoveDuplicates(IEnumerable<Deal> deals)
        {
            return deals.Where(d =>
            {
                if ("BCN".Equals(d.ToCode) && !"SEA".Equals(d.FromCode))
                {
                    return false;
                }

                if (string.IsNullOrEmpty(d.Hours))
                {
                    return false;
                }

                return true;
            });
        }

        private static IEnumerable<Deal> RemoveTypos(IEnumerable<Deal> deals)
        {
            var hawaii = deals.FirstOrDefault(d => d.ToCode.Equals("HNL"));

            if (hawaii != null)
            {
                hawaii.ToName = "Hawaii";
            }

            return deals;
        }

        private static IEnumerable<Deal> AddExtraDeals(IEnumerable<Deal> fixedDeals)
        {
            var extras = GetExtraDeals();

            return fixedDeals.Union(extras);
        }

        private static IEnumerable<Deal> GetExtraDeals()
        {
            var extraDeals = new Queue<Deal>();

            extraDeals.Enqueue(new Deal
            {
                ArrivalTime = "1:50",
                DepartTime = "12:00",
                FromCode = "SEA",
                FromName = "Seattle",
                Hours = "23h 30m",
                Price = 1056,
                Stops = 2,
                ToCode = "SIN",
                ToName = "Singapore"
            });

            extraDeals.Enqueue(new Deal
            {
                ArrivalTime = "9:25",
                DepartTime = "6:35",
                FromCode = "SEA",
                FromName = "Seattle",
                Hours = "29h 10m",
                Price = 1202,
                Stops = 2,
                ToCode = "GIG",
                ToName = "Rio de Janeiro"
            });

            extraDeals.Enqueue(new Deal
            {
                ArrivalTime = "6:20",
                DepartTime = "7:30",
                FromCode = "SEA",
                FromName = "Seattle",
                Hours = "14h 50m",
                Price = 1252,
                Stops = 1,
                ToCode = "LHR",
                ToName = "London"
            });

            return extraDeals;
        }

        private static IEnumerable<Deal> FixPrices(IEnumerable<Deal> deals)
        {
            var barcelona = deals.FirstOrDefault(d => d.ToCode.Equals("BCN"));

            if (barcelona != null)
            {
                barcelona.Price = 479 * 2;
            }

            return deals;
        }
    }
}
