using AdventureWorks.Bikes.API.ViewModels;
using AdventureWorks.Bikes.Infrastructure.Sql.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdventureWorks.Bikes.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly SqlOrdersRepository _SqlOrdersRepository = null;

        public OrdersController(SqlOrdersRepository sqlOrdersRepository)
        {
            _SqlOrdersRepository = sqlOrdersRepository;
       }

        [HttpGet("{id:int:min(1)}")]
        public async Task<OrderDetailsViewModel> GetAsync(int id)
        {
            var order = await _SqlOrdersRepository.GetAsync(id);
            return new OrderDetailsViewModel(order);
        }

        [HttpGet("all")]
        public async Task<IEnumerable<OrderListViewModel>> GetAllAsync(int pageSize = 10, int pageCount = 0)
        {
            var orders = await _SqlOrdersRepository.GetAllAsync(pageSize, pageCount);
            return orders.Select(o => new OrderListViewModel(o));
        }

        [HttpDelete("{id:int:min(1)}")]
        public async Task DeleteAsync(int id)
        {
            await _SqlOrdersRepository.DeleteAsync(id);
        }
    }
}
