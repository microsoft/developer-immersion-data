using AdventureWorks.Bikes.Infrastructure.DocumentDB.Helpers;
using AdventureWorks.Bikes.Infrastructure.DocumentDB.Model;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CreateSampleData
{
    public class DocumentDBDataInitializer
    {
        private string _EndpointUrl = string.Empty;
        private string _Key = string.Empty;
        protected string _DatabaseId = string.Empty;
        static readonly string utc_date = DateTime.UtcNow.ToString("r");
        private static readonly Random Randomize = new Random(12345); // Stable seed for repeatable data generation

        public DocumentDBDataInitializer(IConfigurationRoot configuration)
        {
            _EndpointUrl = configuration["DocumentDB:EndpointUri"];
            _Key = configuration["DocumentDB:Key"];
            _DatabaseId = configuration["DocumentDB:DatabaseId"];
        }

        public async Task Initialize()
        {
            if (! await ExistsDatabase())
            {
                await CreateDatabase();
                await CreateCollection(BikesConstants.Products);
                int productsCount = await CreateProducts();

                await CreateCollection(BikesConstants.ProductPictures);
                await CreateProductPictures(productsCount);

                await CreateCollection(BikesConstants.Stores);
                int storesCount = await CreateStores();

                await CreateCollection(BikesConstants.StorePictures);
                await CreateStorePictures(storesCount);
            }
        }

        async Task CreateDatabase()
        {
            string baseUri = $"{_EndpointUrl}dbs/";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("x-ms-date", utc_date);
                _httpClient.DefaultRequestHeaders.Add("x-ms-version", "2015-08-06");

                string verb = "POST";
                string resourceType = "dbs";
                string resourceId = string.Empty;

                string authHeader = DocumentAuthorization.GenerateMasterKeyAuthorizationSignature(verb, resourceId, resourceType, _Key, "master", "1.0", utc_date);
                _httpClient.DefaultRequestHeaders.Remove("authorization");
                _httpClient.DefaultRequestHeaders.Add("authorization", authHeader);

                var content = JsonConvert.SerializeObject(new { id = _DatabaseId });
                var response = await _httpClient.PostAsync(new Uri(baseUri), new StringContent(content, Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
            }
        }

        async Task<bool> ExistsDatabase()
        {
            string baseUri = $"{_EndpointUrl}dbs/{_DatabaseId}";
            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("x-ms-date", utc_date);
                _httpClient.DefaultRequestHeaders.Add("x-ms-version", "2015-08-06");

                string verb = "GET";
                string resourceType = "dbs";
                string resourceLink = "dbs/" + _DatabaseId;

                string authHeader = DocumentAuthorization.GenerateMasterKeyAuthorizationSignature(verb, resourceLink, resourceType, _Key, "master", "1.0", utc_date);
                _httpClient.DefaultRequestHeaders.Remove("authorization");
                _httpClient.DefaultRequestHeaders.Add("authorization", authHeader);

                var response = await _httpClient.GetAsync(new Uri(baseUri));
                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                    return true;
            }

            return false;
        }

        async Task CreateCollection(string collectionName)
        {
            string uri = $"{_EndpointUrl}dbs/{_DatabaseId}/colls";

            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("x-ms-date", utc_date);
                _httpClient.DefaultRequestHeaders.Add("x-ms-version", "2015-08-06");

                string verb = "POST";
                string resourceType = "colls";
                string resourceLink = $"dbs/{_DatabaseId}/colls";
                string resourceId = $"dbs/{_DatabaseId}";

                string authHeader = DocumentAuthorization.GenerateMasterKeyAuthorizationSignature(verb, resourceId, resourceType, _Key, "master", "1.0", utc_date);
                _httpClient.DefaultRequestHeaders.Remove("authorization");
                _httpClient.DefaultRequestHeaders.Add("authorization", authHeader);

                var content = JsonConvert.SerializeObject(new { id = collectionName });
                var response = await _httpClient.PostAsync(uri, new StringContent(content, Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
            }
        }

        async Task<int> CreateProducts()
        {
            string[] names = {"HL Mountain Frame, Black", "Mountain-100 Black", "Mountain-100 Silver", "Road-250 Black",
                "Touring-1000 Blue", "Touring-2000 Blue", "Touring-3000 Yellow"};
            
            string[] description = {
                "Cross-train, race, or just socialize on a sleek, aerodynamic bike designed for a woman. Advanced seat technology provides comfort all day.",
                "Our best value utilizing the same, ground-breaking frame technology as the ML aluminum frame."
            };

            int[] discount = { 15, 20, 40 };

            int id = 1;
            for (int store = 1; store <= 5; store++)
            {
                foreach (var file in Directory.GetFiles($"sampledata/pictures/bikes", "*.png"))
                {
                    var product = new DBProduct()
                    {
                        Id = id.ToString(),
                        Name = names[Randomize.Next(0, names.Length - 1)],
                        OriginalPrice = Randomize.Next(200, 800),
                        Discount = discount[Randomize.Next(0, discount.Length - 1)],
                        RemainingUnits = Randomize.Next(1, 15),
                        Comments = string.Empty,
                        Description = description[Randomize.Next(0, description.Length - 1)],
                        Rating = Randomize.Next(0, 5),
                        StoreId = store.ToString()
                    };

                    await CreateProduct(product);
                    id++;
                }
            }

            return id;
        }

        async Task<int> CreateProductPictures(int maxProductId)
        {
            int id = 1;

            var files = Directory.GetFiles($"sampledata/pictures/bikes", "*.png");

            for (int productId = 1; productId < maxProductId; productId++)
            {
                var productPicture = new DBProductPicture()
                {
                    Id = id.ToString(),
                    Picture = File.ReadAllBytes(files[Randomize.Next(0, files.Length - 1)]),
                    ProductId = productId.ToString()
                };

                await CreateProductPicture(productPicture);
                id++;
            }

            return id;
        }

        async Task<int> CreateStores()
        {
            string[] names = { "XTZ Bike Shop", "CBIKE Cycling Store", "Be the bike", "Bikes Store" };

            int id = 1;
            foreach (var name in names)
            {
                var store = new DBStore()
                {
                    Id = id.ToString(),
                    Name = name,
                    Description = "Store service description",
                    Rating = Randomize.Next(0, 5),
                    Address = "15 Ski App Way, Redmond Heights Way",
                    City = "Washington",
                    Country = "USA",
                    Email = "store@store.com",
                    Location = new Point(40.721847, -74.007326),
                    Phone = "11",
                    State = "Washington",
                    CreationDate = DateTime.UtcNow
                };

                await CreateStore(store);
                id++;
            }

            return id;
        }

        async Task<int> CreateStorePictures(int maxStoreId)
        {
            int id = 1;

            var files = Directory.GetFiles($"sampledata/pictures/stores", "*.png");
            var firstPicture = File.ReadAllBytes(files[0]);
            var secondPicture = File.ReadAllBytes(files[1]);
            var thirdPicture = File.ReadAllBytes(files[2]);

            for (int storeId = 1; storeId < maxStoreId; storeId++)
            {
                var storePicture = new DBStorePicture()
                {
                    Id = id.ToString(),
                    Picture = File.ReadAllBytes(files[Randomize.Next(0, files.Length - 1)]),
                    StoreId = storeId.ToString(),
                    Position = 1
                };
                await CreateStorePicture(storePicture);
                id++;
                storePicture = new DBStorePicture()
                {
                    Id = id.ToString(),
                    Picture = firstPicture,
                    StoreId = storeId.ToString(),
                    Position = 2
                };
                await CreateStorePicture(storePicture);
                id++;
                storePicture = new DBStorePicture()
                {
                    Id = id.ToString(),
                    Picture = thirdPicture,
                    StoreId = storeId.ToString(),
                    Position = 3
                };
                await CreateStorePicture(storePicture);

                id++;                 
            }

            return id;
        }

        async Task CreateProduct(DBProduct product)
        {
            await CreateDocument(BikesConstants.Products, JsonConvert.SerializeObject(product));
        }

        async Task CreateProductPicture(DBProductPicture productPicture)
        {
            await CreateDocument(BikesConstants.ProductPictures, JsonConvert.SerializeObject(productPicture));
        }

        async Task CreateStore(DBStore store)
        {
            await CreateDocument(BikesConstants.Stores, JsonConvert.SerializeObject(store));
        }

        async Task CreateStorePicture(DBStorePicture storePicture)
        {
            await CreateDocument(BikesConstants.StorePictures, JsonConvert.SerializeObject(storePicture));
        }

        async Task CreateDocument(string collectionName, string content)
        {
            Thread.Sleep(500); // Try to avoid error 429 (Too Many Requests) without increasing the pricing tier. Don´t do this in a real app.

            string uri = $"{_EndpointUrl}dbs/{_DatabaseId}/colls/{collectionName}/docs";
            using (var _httpClient = new HttpClient())
            {
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                _httpClient.DefaultRequestHeaders.Add("x-ms-date", utc_date);
                _httpClient.DefaultRequestHeaders.Add("x-ms-version", "2015-08-06");

                string verb = "POST";
                string resourceType = "docs";
                string resourceLink = $"dbs/{_DatabaseId}/colls/{collectionName}";

                string authHeader = DocumentAuthorization.GenerateMasterKeyAuthorizationSignature(verb, resourceLink, resourceType, _Key, "master", "1.0", utc_date);
                _httpClient.DefaultRequestHeaders.Remove("authorization");
                _httpClient.DefaultRequestHeaders.Add("authorization", authHeader);

                var response = await _httpClient.PostAsync(new Uri(uri), new StringContent(content, Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
            }

        }

    }
}
