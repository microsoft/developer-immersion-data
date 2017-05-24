using Newtonsoft.Json;
using System.Collections.Generic;

namespace AdventureWorks.Bikes.Infrastructure.CosmosDB.Model
{
    public class DBStorePicture
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("picture")]
        public byte[] Picture { get; set; }

        [JsonProperty("storeid")]
        public string StoreId { get; set; }

        [JsonProperty("position")]
        public int Position { get; set; }
    }

    public class DBStorePictureReponse
    {
        public string _rid { get; set; }

        public List<DBStorePicture> Documents { get; set; }

        public int count { get; set; }
    }
}
