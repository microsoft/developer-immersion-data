using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System.IO;
using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.EntityFrameworkCore;
using AdventureWorks.Bikes.Infrastructure.Sql;

namespace CreateSampleData
{
    public class Program
    {
        private static IServiceProvider serviceProvider = null;
        public static IConfigurationRoot Configuration = null;

        public static void Main(string[] args)
        {
            Console.WriteLine("Create Sample Data");

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            Configuration = builder.Build();

            var services = new ServiceCollection();
            ConfigureServices(services);
            serviceProvider = services.BuildServiceProvider();

            var dataInitializer = new BikesDataInitializer();
            var searchDataInitializer = new SearchServiceDataInitializer(Configuration);
            var documentDBDataInitializer = new DocumentDBDataInitializer(Configuration);

            Console.WriteLine("Creating Search Service sample data");
            searchDataInitializer.Initialize().Wait();
            searchDataInitializer.Initialize("products", "index.json", false).Wait();

            Console.WriteLine("Creating DocumentDB sample data");
            documentDBDataInitializer.Initialize().Wait();

            Console.WriteLine("Creating SQL Database sample data");
            dataInitializer.InitializeDatabase(serviceProvider, Directory.GetCurrentDirectory()).Wait();
        }

        private static void ConfigureServices(IServiceCollection services)
        {
            var connection = Configuration.GetConnectionString("IdentityConnection");
            services.AddDbContext<BikesAuthContext>(options => options.UseSqlServer(connection));

            // Register dependencies
            services.ConfigureDependencies(Configuration);

            // Add Identity services to the services container.
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<BikesAuthContext>()
                .AddDefaultTokenProviders();
        }
    }
}
