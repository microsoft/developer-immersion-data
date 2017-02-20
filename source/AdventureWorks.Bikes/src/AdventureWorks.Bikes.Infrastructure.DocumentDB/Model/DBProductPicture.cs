using Newtonsoft.Json;
using System.Collections.Generic;

namespace AdventureWorks.Bikes.Infrastructure.DocumentDB.Model
{
    public class DBProductPicture
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("picture")]
        public byte[] Picture { get; set; }

        [JsonProperty("productid")]
        public string ProductId { get; set; }
    }

    public class DBProductPictureReponse
    {
        public string _rid { get; set; }

        public List<DBProductPicture> Documents { get; set; }

        public int count { get; set; }
    }
}
