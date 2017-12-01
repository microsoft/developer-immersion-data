namespace GraphExplorer.Models
{
    using Newtonsoft.Json;

    public class GraphSettings
    {
        [JsonProperty("iconGroups")]
        public object IconGroups { get; set; }

        [JsonProperty("options")]
        public object Options { get; set; }

        [JsonProperty("showEdgeLabel")]
        public bool ShowEdgeLabel { get; set; }
    }
}