namespace GraphExplorer.Configuration
{
	/// <summary>
	/// Represents a collection of configuration settings for DocDb connection
	/// </summary>
	public class DocDbConfig
	{
        public string Endpoint { get; set; }
        public string AuthKey { get; set; }
        public string Database { get; set; }
    }
}