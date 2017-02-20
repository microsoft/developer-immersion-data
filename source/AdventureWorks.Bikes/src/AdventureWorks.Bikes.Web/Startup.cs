using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using AdventureWorks.Bikes.Infrastructure.Sql;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using AdventureWorks.Bikes.Web.AppBuilderExtensions;
using AdventureWorks.Bikes.Web.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using AspNet.Security.OAuth.Validation;
using AdventureWorks.Bikes.Infrastructure.SearchService.Initializer;
using AdventureWorks.Bikes.Infrastructure.DocumentDB.Initializer;
using Microsoft.EntityFrameworkCore;

namespace AdventureWorks.Bikes.Web
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var connection = Configuration.GetConnectionString("IdentityConnection");
            services.AddDbContext<BikesAuthContext>(options => options.UseSqlServer(connection));

            // Register dependencies
            services.ConfigureDependencies(Configuration);

            services.AddMemoryCache();

            services.AddAuthentication();

            // Add Identity services to the services container.
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<BikesAuthContext>()
                .AddDefaultTokenProviders();

            services.AddApplicationInsightsTelemetry(Configuration);

            // Add framework services.
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver =
                    new CamelCasePropertyNamesContractResolver();
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder => builder
                                .AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials());
            });

            services.ConfigureSwaggerDoc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public async void Configure(IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory loggerFactory,
            AuthorizationProvider authorizationProvider,
            BikesDataInitializer dataInitializer, SearchServiceDataInitializer searchDataInitializer,
            DocumentDBDataInitializer documentDBDataInitializer)
        {
            // Add Application Insights monitoring to the request pipeline as a very first middleware.
            app.UseApplicationInsightsRequestTelemetry();

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            // Default is index 
            app.UseDefaultFiles(
                new DefaultFilesOptions()
                {
                    DefaultFileNames = new[] { "index.html" }
                }
            );

            // Add Application Insights exceptions handling to the request pipeline.
            app.UseApplicationInsightsExceptionTelemetry();

            app.UseStaticFiles();

            app.UseCors("AllowAllOrigins");

            //Basic openId.connect server
            app.UseOpenIdConnectServer(options =>
            {
                options.Provider = authorizationProvider;
                options.AllowInsecureHttp = true;
                options.ApplicationCanDisplayErrors = true;
            });

            app.UseOAuthValidation(new OAuthValidationOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
            });

            app.UseMiddleware<RequiredScopesMiddleware>(new List<string> { "api" });

            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUi();

            await searchDataInitializer.Initialize();
            await documentDBDataInitializer.Initialize();
            await dataInitializer.InitializeDatabase(app.ApplicationServices, env.ContentRootPath);
        }
    }
}
