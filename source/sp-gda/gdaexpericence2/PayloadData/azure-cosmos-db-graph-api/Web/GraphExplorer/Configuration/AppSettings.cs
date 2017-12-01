namespace GraphExplorer.Configuration
{
    using Newtonsoft.Json;
	using Newtonsoft.Json.Linq;
	using System;
	using System.IO;

	// Super simple AppSettings class
	public sealed class AppSettings
	{
		private const string SETTINGS_FILE = "appsettings.json";
		private dynamic _allSettings = null;

		private static readonly AppSettings _instance = new AppSettings();

		private AppSettings()
		{
			string json = System.IO.File.ReadAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, SETTINGS_FILE));
			_allSettings = JsonConvert.DeserializeObject(json);
		}

		/// <summary>
		/// Returns the one and only instance of AppSettings
		/// </summary>
		public static AppSettings Instance
		{
			get
			{
				return _instance;
			}
		}
      
        private string _version;
		/// <summary>
		/// Gets the application's version as a string in the form: major.minor.build.revision
		/// </summary>
		public string Version
		{
			get
			{
				if (_version == null)
				{
					_version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString();
				}
				return _version;
			}
		}

		/// <summary>
		/// Returns the named section from within appsettings.json, deserialized to a concrete instance of Type T
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="sectionName"></param>
		/// <returns></returns>
		public T GetSection<T>(string sectionName)
		{
			return (_allSettings[sectionName] as JObject).ToObject<T>();
		}
    }
}