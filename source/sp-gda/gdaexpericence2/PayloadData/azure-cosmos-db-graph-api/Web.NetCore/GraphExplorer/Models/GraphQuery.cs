namespace GraphExplorer.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// Graph Query Class
    /// </summary>
    public class GraphQuery
    {
        /// <summary>
        /// Gets or sets the Identifier
        /// </summary>
        [JsonProperty("id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the title
        /// </summary>
        [JsonProperty("title")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the title
        /// </summary>
        [JsonProperty("query")]
        public string Query { get; set; }
    }
}