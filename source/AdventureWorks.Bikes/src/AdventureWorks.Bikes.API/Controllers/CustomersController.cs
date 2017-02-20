using AdventureWorks.Bikes.API.ViewModels;
using AdventureWorks.Bikes.Infrastructure.Sql.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AdventureWorks.Bikes.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class CustomersController : Controller
    {
        private readonly SqlCustomersRepository _SqlCustomersRepository = null;

        public CustomersController(SqlCustomersRepository sqlCustomersRepository)
        {
            _SqlCustomersRepository = sqlCustomersRepository;
        }

        [HttpGet("{id:int:min(1)}")]
        public async Task<CustomerDetailViewModel> GetAsync(int id)
        {
            var customer = await _SqlCustomersRepository.GetAsync(id);
            if (customer != null)
                return new CustomerDetailViewModel(customer);

            return null;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<CustomerListViewModel>> GetAllAsync(int pageSize = 10, int pageCount = 0, string name = "")
        {
            var customers = string.IsNullOrEmpty(name) ? 
                await _SqlCustomersRepository.GetAllAsync(pageSize, pageCount) :
                await _SqlCustomersRepository.GetCustomersByName(name);
            
            return customers.Select(c => new CustomerListViewModel(c));
        }
    }
}
