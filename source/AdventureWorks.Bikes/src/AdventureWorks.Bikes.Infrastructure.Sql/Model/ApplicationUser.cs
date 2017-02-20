using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }

        public string ConnectionString { get; set; }

    }
}
