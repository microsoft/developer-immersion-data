using AdventureWorks.Bikes.Infrastructure.CosmosDB.Model;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using AdventureWorks.Bikes.Infrastructure.CosmosDB.Helpers;
using Newtonsoft.Json;
namespace AdventureWorks.Bikes.Infrastructure.CosmosDB.Repositories
{
    public class DBStoresRepository : CosmosDBRequest
    {
        public DBStoresRepository(IConfigurationRoot configuration)
            : base(configuration)
        {
        }

        public async Task<DBStore> GetAsync(string id)
        {
            string query = $"SELECT TOP 1 * FROM {BikesConstants.Stores} s where s.id=@id";
            var parameters = new List<DBParameter>();
            parameters.Add(new DBParameter() { name = "@id", value = id });
            string response = await ExecuteQuery(BikesConstants.Stores, query, parameters);
            List<DBStore> docs = JsonConvert.DeserializeObject<DBStoreReponse>(response).Documents;

            if (docs != null)
                return docs.FirstOrDefault();
            else
                return null;
        }

        public async Task<IEnumerable<DBStore>> GetAllAsync(int count)
        {
            string query = $"SELECT TOP {count} * FROM {BikesConstants.Stores} s";
            string response = await ExecuteQuery(BikesConstants.Stores, query);
            return JsonConvert.DeserializeObject<DBStoreReponse>(response).Documents;
        }

        public async Task<IEnumerable<DBStore>> GetByIdsAsync(List<string> ids)
        {
            // TODO: Use parameters
            var sIds = string.Join("\",\"", ids);
            string query = $"SELECT * FROM {BikesConstants.Stores} s WHERE s.id in (\"{sIds}\")";
            string response = await ExecuteQuery(BikesConstants.Stores, query);
            return JsonConvert.DeserializeObject<DBStoreReponse>(response).Documents;
        }

        public async Task<IEnumerable<DBStoreDistance>> GetStoreDistanceAsync(double latitude, double longitude)
        {
            string query =
                $" SELECT s.id, ST_DISTANCE(s.location, {{'type': 'Point', 'coordinates':[{latitude}, {longitude}]}}) As distance " +
                $" FROM {BikesConstants.Stores} s ";

            string response = await ExecuteQuery(BikesConstants.Stores, query);
            return JsonConvert.DeserializeObject<DBStoreDistanceReponse>(response).Documents;
        }

        public async Task<IEnumerable<DBStore>> GetNewStoresByAsync(int count)
        {
            string query = $"SELECT TOP {count} * FROM {BikesConstants.Stores} s";
            string response = await ExecuteQuery(BikesConstants.Stores, query);
            return JsonConvert.DeserializeObject<DBStoreReponse>(response).Documents;
        }

        public async Task<byte[]> GetStorePictureAsync(string storeId, int position)
        {
            // TODO: Use parameters
            string query = $"SELECT TOP 1 s.picture FROM {BikesConstants.StorePictures} s " +
                $" WHERE s.storeid=@storeid and s.position={position}";

            var parameters = new List<DBParameter>();
            parameters.Add(new DBParameter() { name = "@storeid", value = storeId });

            string response = await ExecuteQuery(BikesConstants.StorePictures, query, parameters);
            List<DBStorePicture> docs  = JsonConvert.DeserializeObject<DBStorePictureReponse>(response).Documents;
            if (docs != null)
                return docs.FirstOrDefault().Picture;
            else
                return null;
        }
    }
}
