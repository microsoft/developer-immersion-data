using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using AdventureWorks.Bikes.Infrastructure.Sql.Helpers;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Repositories
{
    public class SqlOrdersRepository
    {
        BikesContext _context;

        public SqlOrdersRepository(BikesContextBuilder contextBuilder)
        {
            _context = contextBuilder.Create();
        }

        public string ConnectionString { get; set; }

        public async Task<Order> GetAsync(int id)
        {
            return await _context.Orders
                .SingleOrDefaultAsync(o => o.OrderId == id);
        }

        public async Task<IEnumerable<Order>> GetAllAsync(int pageSize, int pageCount)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(d => d.OrderId)
                .Skip(pageSize * pageCount)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> AddAsync(Order Order)
        {
            _context.Orders.Add(Order);
            await _context.SaveChangesAsync();
            return Order.OrderId;
        }

        public async Task UpdateAsync(Order Order)
        {
            _context.Orders.Update(Order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var rental = await _context.Orders
                .SingleOrDefaultAsync(o => o.OrderId == id);

            if (rental != null)
            {
                _context.Orders.Remove(rental);
                await _context.SaveChangesAsync();
            }
        }
    }
}
