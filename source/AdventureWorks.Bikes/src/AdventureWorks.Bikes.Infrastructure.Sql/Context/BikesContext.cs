using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Context
{
    public class BikesContext : DbContext
    {
        public BikesContext()
        {
        }

        public BikesContext(DbContextOptions options)
               : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<OrderLine>().HasOne(o => o.Product).WithMany(p => p.OrderLines).OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Store> Stores { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<Product> Products { get; set; }
    }
}
