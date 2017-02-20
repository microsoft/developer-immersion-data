using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using AdventureWorks.Bikes.Infrastructure.Sql.Helpers;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Repositories
{
    public class SqlStoresRepository
    {
        BikesContext _context;

        public SqlStoresRepository(BikesContext context)
        {
            _context = context;
        }

        public async Task<Store> GetAsync(int id)
        {
            return await _context.Stores
                .SingleOrDefaultAsync(r => r.StoreId == id);
        }

        public async Task<IEnumerable<Store>> GetAllAsync(int pageSize = 10, int pageCount = 0)
        {
            return await _context.Stores
                .OrderBy(d => d.Name)
                .Skip(pageSize * pageCount)
                .Take(pageSize)
                .ToListAsync();
        }


        public async Task<IEnumerable<Store>> GetNearByAsync(double latitude, double longitude, int count)
        {
            return await _context.Stores
                .OrderBy(s => MathCoordinates.GetDistance(s.Latitude, s.Longitude, latitude, longitude, 'M'))
                .Take(count)
                .ToListAsync();
        }

    }
}
