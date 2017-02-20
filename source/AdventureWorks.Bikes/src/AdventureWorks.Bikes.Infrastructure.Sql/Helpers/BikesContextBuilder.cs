using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using AdventureWorks.Bikes.Infrastructure.Sql.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Helpers
{
    public class BikesContextBuilder
    {
        private readonly IHttpContextAccessor _Accessor = null;
        private readonly IConfigurationRoot _Configuration = null;
        private readonly SqlUsersRepository _SqlUsersRepository = null;

        public BikesContextBuilder(IHttpContextAccessor accessor,
            IConfigurationRoot configuration, SqlUsersRepository sqlUsersRepository)
        {
            _Accessor = accessor;
            _Configuration = configuration;
            _SqlUsersRepository = sqlUsersRepository;
        }

        public BikesContext Create()
        {
            var builder = new DbContextOptionsBuilder();
            var connectionString = _SqlUsersRepository.GetConnnectionString(GetUser());
            builder.UseSqlServer(connectionString);
            return new BikesContext(builder.Options);
        }

        string GetUser()
        {
            if (_Accessor.HttpContext.User.Identity.IsAuthenticated)
                return _Accessor.HttpContext.User.FindFirst("username").Value;
            else
                // Used in demos to allow not authenticated scenarios.
                return _Configuration["DefaultUsername"];
        }
    }
}
