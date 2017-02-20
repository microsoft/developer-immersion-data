using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Repositories
{
    public class SqlProductsRepository
    {
        BikesContext _context;

        public SqlProductsRepository(BikesContext context)
        {
            _context = context;
        }

        public async Task<Product> GetAsync(int id)
        {
            return await _context.Products
                .Where(p => p.ProductId == id)
                .Select(p => BuildProduct(p))
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Product>> GetAllAsync(string searchtext, int pageSize, int pageCount)
        {
            return await _context.Products
                .Include(p => p.Store)
                .Where(p => p.Description.Contains(searchtext))
                .OrderBy(p => p.Name)
                .Skip(pageSize * pageCount)
                .Take(pageSize)
                .Select(p => BuildProduct(p))
                .ToListAsync();
        }

        public async Task<byte[]> GetPictureAsync(int id)
        {
            byte[] picture = null;
            var product = await _context.Products.SingleOrDefaultAsync(p => p.ProductId == id);
            if (product != null)
                picture = product?.Picture;

            return picture;
        }

        Product BuildProduct(Product p)
        {
            return new Product()
            {
                ProductId = p.ProductId,
                Name = p.Name,
                OriginalPrice = p.OriginalPrice,
                Discount = p.Discount,
                RemainingUnits = p.RemainingUnits,
                Comments = p.Comments,
                Description = p.Description,
                Rating = p.Rating,
                StoreId = p.StoreId,
                Store = new Store()
                {
                    StoreId = p.StoreId,
                    Name = p.Store.Name
                }
            };
        }
    }
}
