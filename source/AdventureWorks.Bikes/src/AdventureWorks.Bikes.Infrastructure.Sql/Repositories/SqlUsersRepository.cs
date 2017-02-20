using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Repositories
{
    public class SqlUsersRepository
    {
        BikesAuthContext _context;

        public SqlUsersRepository(BikesAuthContext context)
        {
            _context = context;
        }

        public async Task<ApplicationUser> GetUserAsync(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == username);

            if (user != null)
            {
                return new ApplicationUser()
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    FullName = user.FullName,
                    Email = user.Email
                };
            }

            return null;
        }

        public string GetConnnectionString(string username)
        {
            var user = _context.Users
                .SingleOrDefaultAsync(u => u.UserName.ToLower() == username.ToLower())
                .Result;

            if (user != null)
                return user.ConnectionString;

            return null;
        }

    }
}
