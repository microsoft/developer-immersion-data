
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Context
{
    public class BikesAuthContext : IdentityDbContext<ApplicationUser>
    {
        public BikesAuthContext(DbContextOptions<BikesAuthContext> options)
            : base (options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
