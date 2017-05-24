using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace AdventureWorks.Bikes.Infrastructure.CosmosDB.Model
{
    public class DBStore
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("location")]
        public Point Location { get; set; }

        [JsonProperty("rating")]
        public double Rating { get; set; }

        [JsonProperty("creationDate")]
        public DateTime CreationDate { get; set; }
    }

    public class Point
    {
        public Point(double latitude, double longitude)
        {
            Type = "Point";
            Coordinates = new double[2];
            Coordinates[0] = latitude;
            Coordinates[1] = longitude;
        }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("coordinates")]
        public double[] Coordinates { get; set; }
    }

    public class DBStoreReponse
    {
        public string _rid { get; set; }

        public List<DBStore> Documents { get; set; }

        public int count { get; set; }
    }
}
