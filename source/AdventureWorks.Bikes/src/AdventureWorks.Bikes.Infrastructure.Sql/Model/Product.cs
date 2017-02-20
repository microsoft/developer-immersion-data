
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Model
{
    public class Product
    {
        public int ProductId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Comments { get; set; }

        public double OriginalPrice { get; set; }

        public int Discount { get; set; }

        public int RemainingUnits { get; set; }

        public double Rating { get; set; }

        public byte[] Picture { get; set; }

        public virtual ICollection<OrderLine> OrderLines { get; set; }

        public int StoreId { get; set; }

        public virtual Store Store { get; set; }
    }
}

