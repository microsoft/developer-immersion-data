using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Threading;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AdventureWorks.Bikes.Infrastructure.Sql
{
    public class BikesDataInitializer
    {
        private static readonly Random Randomize = new Random();
        private static string _DefaultEmail = string.Empty;
        private static string _DefaultUserName = string.Empty;
        private static string _DefaultFullName = string.Empty;
        private static string _DefaultPassword = string.Empty;
        private static string _DefaultConnectionString = string.Empty;
        private static string _BasePath = string.Empty;
        private static IServiceProvider _ServiceProvider = null;
        private const int TIMEOUT = -2;
        private const int MAX_RETRIES = 10;
        private const int DATABASE_NOT_AVAILABLE = 40613;
        string[] stores = { "XTZ Bike Shop", "CBIKE Cycling Store", "Be the bike", "Bikes Store" };

        public async Task InitializeDatabase(IServiceProvider serviceProvider, string basePath)
        {
            _ServiceProvider = serviceProvider;
            _BasePath = basePath;
            LoadDefaultSettings();
            await InitializeAuthDatabase();
            await InitializeDefaultStoreDatabase();
            await CreateAdditionalStoreDatabases();
        }

        private async Task InitializeDefaultStoreDatabase(int attempt = 1)
        {
            try
            {
                Console.WriteLine("Initialize default store database");
                var builder = new DbContextOptionsBuilder();
                builder.UseSqlServer(_DefaultConnectionString);
                var context = new BikesContext(builder.Options);
                var databaseCreated = await context.Database.EnsureCreatedAsync();
                if (databaseCreated)
                {
                    await InitializeDatabaseData(context);
                }
            }
            catch (SqlException ex)
            {
                if (MustRetry(ex.Number, attempt))
                {
                    attempt++;
                    await InitializeDefaultStoreDatabase(attempt);
                }
            }
        }

        private async Task InitializeAuthDatabase(int attempt = 1)
        {
            using (var db = _ServiceProvider.GetService<BikesAuthContext>())
            {
                try
                {
                    Console.WriteLine("Creating Auth Database");
                    var databaseCreated = await db.Database.EnsureCreatedAsync();
                    if (databaseCreated)
                    {
                        Console.WriteLine("Creating default users");
                        await CreateUsers();
                    }
                }
                catch (SqlException ex)
                {
                    if (MustRetry(ex.Number, attempt))
                    {
                        attempt++;
                        await InitializeAuthDatabase(attempt);
                    }
                }
            }
        }


        async Task InitializeDatabaseData(BikesContext context)
        {
            Console.WriteLine("Initialize data");
            try
            {
                await CreateCustomers(context);
                await CreateStores(context);
                await CreateProducts(context);
                await CreateOrders(context);
            }
            catch (Exception ex)
            {
                // it´s sample data so log the error message and continue.
                Console.WriteLine(ex.Message);
            }
        }

        private void LoadDefaultSettings()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(_BasePath)
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables();

            var configuration = builder.Build();

            _DefaultUserName = configuration["DefaultUsername"];
            _DefaultFullName = configuration["DefaultFullName"];
            _DefaultEmail = configuration["DefaultEmail"];
            _DefaultPassword = configuration["DefaultPassword"];
            _DefaultConnectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private async Task CreateUsers()
        {
            await CreateUser(_DefaultUserName, _DefaultFullName, _DefaultPassword, _DefaultEmail, _DefaultConnectionString);
            for (int i = 1; i < stores.Length; i++)
            {
                var connectionBuilder = new SqlConnectionStringBuilder(_DefaultConnectionString);
                connectionBuilder.InitialCatalog = $"adventureworks.bikes.Store{i}";
                await CreateUser($"store{i}", _DefaultFullName, _DefaultPassword, _DefaultEmail, connectionBuilder.ConnectionString);
            }
        }

        private async Task CreateUser(string username, string fullName, string password, string email, string connectionstring)
        {
            var userManager = _ServiceProvider.GetService<UserManager<ApplicationUser>>();
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = username.ToLowerInvariant(),
                    FullName = fullName,
                    Email = email,
                    ConnectionString = connectionstring
                };

                var result = await userManager.CreateAsync(user, password);
            }
        }

        private async Task CreateAdditionalStoreDatabases()
        {
            var connectionBuilder = new SqlConnectionStringBuilder(_DefaultConnectionString);

            for (int i = 2; i <= stores.Length; i++)
            {
                Console.WriteLine($"Create database adventureworks.bikes.Store{i}");
                connectionBuilder.InitialCatalog = $"adventureworks.bikes.Store{i}";
                var context = await CreateStoreDatabase(connectionBuilder.ConnectionString);
                if (context != null)
                    await InitializeDatabaseData(context);
            }
        }

        private async Task<BikesContext> CreateStoreDatabase(string connectionstring, int attempt = 1)
        {
            BikesContext context = null;

            try
            {
                var builder = new DbContextOptionsBuilder();
                builder.UseSqlServer(connectionstring);
                context = new BikesContext(builder.Options);
                var databaseCreated = await context.Database.EnsureCreatedAsync();
                if (!databaseCreated)
                    context = null;
            }
            catch (SqlException ex)
            {
                if (MustRetry(ex.Number, attempt))
                {
                    attempt++;
                    await CreateStoreDatabase(connectionstring, attempt);
                }
            }

            return context;
        }

        async Task CreateCustomers(BikesContext context)
        {
            string[] names = { "Andrew", "John", "Scott", "Ibon"};
            string[] lastnames = { "Davis", "Smith", "Williams" };
            string[] creditCards = { "3767-8552-8051-1396", "3768-4662-3931-2047", "3427-6256-3187-6899", "3735-0437-5831-7278", "3483-9488-5688-8810" };

            foreach (var name in names)
            {
                foreach (var lastname in lastnames)
                {
                    var customer = new Customer()
                    {
                        FirstName = name,
                        LastName = lastname,
                        Address = "15 Ski App Way, Redmond Heights Way",
                        City = "Washington",
                        Country = "USA",
                        Email = $"{name}@outlook.com".ToLowerInvariant(),
                        LastOrder = DateTime.UtcNow.AddDays(-1 * Randomize.Next(1, 40)),
                        Phone = "555-555-555",
                        ZipCode = "444-456",
                        State = "Washington",
                        CreditCardNumber = creditCards[Randomize.Next(0, 4)],
                        RegistrationDate = DateTime.UtcNow.AddMonths(-1 * Randomize.Next(3, 6))
                    };

                    context.Customers.Add(customer);
                    await context.SaveChangesAsync();
                }
            }
        }

        async Task CreateStores(BikesContext context)
        {
            foreach (var storeName in stores)
            {
                var store = new Store()
                {
                    Name = storeName,
                    Rating = Randomize.Next(0, 5),
                    Address = "15 Ski App Way, Redmond Heights Way",
                    City = "Washington",
                    Country = "USA",
                    Email = "store@store.com",
                    Latitude = 40.721847,
                    Longitude = -74.007326,
                    Phone = "11",
                    State = "Washington"
                };

                context.Stores.Add(store);
                await context.SaveChangesAsync();
            }
        }

        async Task CreateProducts(BikesContext context)
        {
            string[] names = {"HL Mountain Frame, Black", "Mountain-100 Black", "Mountain-100 Silver", "Road-250 Black",
                "Touring-1000 Blue", "Touring-2000 Blue", "Touring-3000 Yellow"};

            string[] description = {
                "Cross-train, race, or just socialize on a sleek, aerodynamic bike designed for a woman. Advanced seat technology provides comfort all day.",
                "Our best value utilizing the same, ground-breaking frame technology as the ML aluminum frame."
            };

            var storeIds = context.Stores.Select(s => s.StoreId).ToList();

            foreach (var file in Directory.GetFiles($"sampledata/pictures/bikes", "*.png"))
            {
                byte[] picture = File.ReadAllBytes(file);
                foreach (var storeId in storeIds)
                {
                    try
                    {
                        var product = new Product()
                        {
                            Name = names[Randomize.Next(0, names.Length - 1)],
                            OriginalPrice = Randomize.Next(200, 800),
                            Discount = Randomize.Next(10, 50),
                            RemainingUnits = Randomize.Next(10, 250),
                            Comments = string.Empty,
                            Description = description[Randomize.Next(0, description.Length - 1)],
                            Rating = Randomize.Next(0, 5),
                            StoreId = storeId,
                            Picture = picture
                        };

                        context.Products.Add(product);
                        await context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        // it´s sample data so log the error message and continue.
                        Console.WriteLine(ex.Message);
                    }
                }
            }
        }

        async Task CreateOrders(BikesContext context)
        {
            var customers = context.Customers.ToList();
            var stores = context.Stores.Select(s => s.StoreId).ToList();
            foreach (var storeId in stores)
            {
                var products = context.Products.Select(p => p.ProductId).ToArray();
                foreach (var customer in customers)
                {
                    var numberOfUnits = Randomize.Next(1, 2);
                    var pricePerUnit = Randomize.Next(50, 300);
                    var order = new Order()
                    {
                        CustomerId = customer.CustomerId,
                        Date = DateTime.UtcNow.AddDays(-1 * Randomize.Next(1, 40)),
                        Comments = string.Empty,
                        Status = Model.Enums.Status.Pending,
                        StoreId = storeId,
                        TotalPrice = Randomize.Next(150, 700),
                        OrderLines = new List<OrderLine>()
                        {
                            new OrderLine()
                            {
                                NumberOfUnits = numberOfUnits,
                                TotalPrice = pricePerUnit * numberOfUnits,
                                PricePerUnit = pricePerUnit,
                                ProductId = products[Randomize.Next(0, products.Count() - 1)]
                            }
                        }
                    };

                    context.Orders.Add(order);
                    await context.SaveChangesAsync();
                }
            };
        }
        
        private bool MustRetry(int exceptionNumber, int attempt)
        {
            if (attempt < MAX_RETRIES)
            {
                // workaround to work with EF core rc1 and SQL Database v12.
                Thread.Sleep(5000);
                return true;
            }

            return false;
        }
    }
}
