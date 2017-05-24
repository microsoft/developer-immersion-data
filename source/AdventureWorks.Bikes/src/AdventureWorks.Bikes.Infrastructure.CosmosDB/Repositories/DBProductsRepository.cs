
using AdventureWorks.Bikes.Infrastructure.CosmosDB.Helpers;
using AdventureWorks.Bikes.Infrastructure.CosmosDB.Model;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdventureWorks.Bikes.Infrastructure.CosmosDB.Repositories
{
    public class DBProductsRepository : CosmosDBRequest
    {
        public DBProductsRepository(IConfigurationRoot configuration) 
            : base(configuration)
        {
        }

        public async Task<DBProduct> GetAsync(string productId)
        {
            string query = 
                $" SELECT TOP 1 * FROM {BikesConstants.Products} p where p.id=@productId";

            var parameters = new List<DBParameter>();
            parameters.Add(new DBParameter() { name = "@productId", value = productId });

            string response = await ExecuteQuery(BikesConstants.Products, query, parameters);
            List<DBProduct> docs = JsonConvert.DeserializeObject<DBProductReponse>(response).Documents;

            if (docs != null)
                return docs.FirstOrDefault();
            else
                return null;
        }

        public async Task<IEnumerable<DBProduct>> GetByIdsAsync(List<string> ids)
        {
            var sIds = string.Join("\",\"", ids);
            string query = $"SELECT * FROM {BikesConstants.Products} p WHERE p.id in (\"{sIds}\")";
            string response = await ExecuteQuery(BikesConstants.Products, query);
            return JsonConvert.DeserializeObject<DBProductReponse>(response).Documents;
        }

        public async Task<IEnumerable<DBProduct>> GetByStoreIdAsync(string storeId, int count)
        {
            string query = $"SELECT TOP {count} * FROM {BikesConstants.Products} p where p.storeid=@storeid";
            var parameters = new List<DBParameter>();
            parameters.Add(new DBParameter() { name = "@storeid", value = storeId });
            string response = await ExecuteQuery(BikesConstants.Products, query, parameters);
            return JsonConvert.DeserializeObject<DBProductReponse>(response).Documents;
        }

        public async Task<byte[]> GetPictureAsync(string productId)
        {
            string query = $"SELECT TOP 1 p.picture FROM {BikesConstants.ProductPictures} p where p.id=@productId";
            var parameters = new List<DBParameter>();
            parameters.Add(new DBParameter() { name = "@productId", value = productId });
            string response = await ExecuteQuery(BikesConstants.ProductPictures, query, parameters);
            List<DBProductPicture> docs = JsonConvert.DeserializeObject<DBProductPictureReponse>(response).Documents;
            if (docs != null)
                return docs.FirstOrDefault().Picture;
            else
                return null;
        }
    }
}
