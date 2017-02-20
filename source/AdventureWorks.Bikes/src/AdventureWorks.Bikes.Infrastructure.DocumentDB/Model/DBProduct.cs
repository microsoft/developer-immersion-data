

using Newtonsoft.Json;
using System.Collections.Generic;

namespace AdventureWorks.Bikes.Infrastructure.DocumentDB.Model
{
    public class DBProduct
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("comments")]
        public string Comments { get; set; }

        [JsonProperty("originalPrice")]
        public double OriginalPrice { get; set; }

        [JsonProperty("discount")]
        public int Discount { get; set; }

        [JsonProperty("remainingUnits")]
        public int RemainingUnits { get; set; }

        [JsonProperty("rating")]
        public double Rating { get; set; }

        [JsonProperty("storeid")]
        public string StoreId { get; set; }
    }

    public class DBProductReponse
    {
        public string _rid { get; set; }

        public List<DBProduct> Documents { get; set; }

        public int count { get; set; }
    }
}

