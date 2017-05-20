using AdventureWorks.Bikes.Infrastructure.CosmosDB.Initializer;
using AdventureWorks.Bikes.Infrastructure.CosmosDB.Repositories;
using AdventureWorks.Bikes.Infrastructure.SearchService.Initializer;
using AdventureWorks.Bikes.Infrastructure.SearchService.Services;
using AdventureWorks.Bikes.Infrastructure.Sql;
using AdventureWorks.Bikes.Infrastructure.Sql.Helpers;
using AdventureWorks.Bikes.Infrastructure.Sql.Repositories;
using AdventureWorks.Bikes.Web.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AdventureWorks.Bikes.Web.AppBuilderExtensions
{
    public static class DependenciesExtensions
    {
        public static IServiceCollection ConfigureDependencies
            (this IServiceCollection services, IConfigurationRoot configuration)
        {
            services.AddTransient<AuthorizationProvider>();

            services.AddScoped<IConfigurationRoot>(c => { return configuration; });
            services.AddScoped<BikesDataInitializer>();

            services.AddScoped<SearchServiceDataInitializer>();
            services.AddScoped<SearchServiceProductsRepository>();

            services.AddScoped<CosmosDBDataInitializer>();

            services.AddScoped<DBStoresRepository>();
            services.AddScoped<DBProductsRepository>();
            services.AddScoped<SqlUsersRepository>();
            services.AddScoped<SqlProductsRepository>();
            services.AddScoped<SqlStoresRepository>();

            services.AddTransient<BikesContextBuilder>();
            services.AddTransient<SqlOrdersRepository>();
            services.AddTransient<SqlCustomersRepository>();

            return services;
        }
    }



}
