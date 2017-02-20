using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.Swagger.Model;

namespace AdventureWorks.Bikes.Web.AppBuilderExtensions
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection ConfigureSwaggerDoc(this IServiceCollection services)
        {
            services.AddSwaggerGen();

            services.ConfigureSwaggerGen(options =>
            {
                options.SingleApiVersion(new Info
                {
                    Version = "v1",
                    Title = "AdventureWorks Bikes",
                    Description = "Demo app",
                    TermsOfService = string.Empty
                });
                options.DescribeAllEnumsAsStrings();
            });

            return services;
        }
    }
}
