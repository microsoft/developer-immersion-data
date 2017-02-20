using System.Collections.Generic;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Model
{
    public class Store
    {
        public int StoreId { get; set; }

        public string ConnectionString { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Country { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public double Rating { get; set; }

        public virtual ICollection<Product> Products { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
