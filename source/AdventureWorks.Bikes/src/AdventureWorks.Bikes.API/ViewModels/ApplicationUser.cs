
using AdventureWorks.Bikes.Infrastructure.Sql.Model;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class ApplicationUserViewModel
    {
        public ApplicationUserViewModel(ApplicationUser user)
        {
            if (user != null)
            {
                FullName = user.FullName;
            }
        }
        public string FullName { get; set; }
    }
}
