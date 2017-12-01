namespace GraphExplorer.Utilities
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    public class FileSystemRepository<T> : IRepository<T>
    {
        private string _fullFilePath = string.Empty;
        private string _defaultItem = "__defaultItem";

        Dictionary<string, T> _allItems;
        private object _theLock = new object();

        public FileSystemRepository(string filename)
        {
            _fullFilePath = Path.Combine(AppDomain.CurrentDomain.GetData("DataDirectory").ToString(), filename);
            _allItems = ReadAllItems();
        }

        public async Task<T> GetItemAsync(string collectionId)
        {
            T item;
            if(!_allItems.TryGetValue(collectionId, out item))
            {
                //create a new T and put default items in it
                await CreateOrUpdateItemAsync(_allItems[_defaultItem], collectionId);
                item = _allItems[_defaultItem];
            }

            return await Task.FromResult<T>(item);
        }

        public async Task CreateOrUpdateItemAsync(T item, string collectionId)
        {
            await Task.Yield();

            // add (or overwrite) item for this collection
            _allItems[collectionId] = item;
            SaveToRepository();
        }

        public async Task DeleteItemAsync(string id, string collectionId)
        {
            await Task.Yield();

            if (_allItems.ContainsKey(collectionId))
            {
                _allItems.Remove(collectionId);
                SaveToRepository();
            }
        }

        private Dictionary<string, T> ReadAllItems()
        {
            string json = string.Empty;
            if (File.Exists(_fullFilePath))
            {
                json = File.ReadAllText(_fullFilePath);
            }

            if (!string.IsNullOrEmpty(json))
            {
                return JsonConvert.DeserializeObject<Dictionary<string, T>>(json);
            }
            else
            {
                return new Dictionary<string, T>();
            }
        }

        private void SaveToRepository()
        {
            lock (_theLock)
            {
                using (FileStream fs = new FileStream(_fullFilePath, FileMode.Create))
                {
                    using (StreamWriter streamWriter = new StreamWriter(fs))
                    {
                        using (JsonWriter jw = new JsonTextWriter(streamWriter))
                        {
                            jw.Formatting = Formatting.Indented;

                            JsonSerializer serializer = new JsonSerializer();
                            serializer.Serialize(jw, _allItems);
                        }
                    }
                }
            }
        }
    }
}
