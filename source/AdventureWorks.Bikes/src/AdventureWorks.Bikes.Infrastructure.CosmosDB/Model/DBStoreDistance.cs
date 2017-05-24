using Newtonsoft.Json;
using System.Collections.Generic;

namespace AdventureWorks.Bikes.Infrastructure.CosmosDB.Model
{
    public class DBStoreDistance
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("distance")]
        public double Distance { get; set; }
    }


    public class DBStoreDistanceReponse
    {
        public string _rid { get; set; }

        public List<DBStoreDistance> Documents { get; set; }

        public int count { get; set; }
    }
}
