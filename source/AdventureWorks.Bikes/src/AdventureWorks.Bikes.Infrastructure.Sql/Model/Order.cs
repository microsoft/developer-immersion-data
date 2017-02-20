
using AdventureWorks.Bikes.Infrastructure.Sql.Model.Enums;
using System;
using System.Collections.Generic;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Model
{
    public class Order
    {
        public int OrderId { get; set; }

        public decimal TotalPrice { get; set; }

        public string Comments { get; set; }

        public DateTime Date { get; set; }

        public Status Status { get; set; }

        public virtual ICollection<OrderLine> OrderLines { get; set; }

        public int CustomerId { get; set; }

        public virtual Customer Customer { get; set; }

        public int StoreId { get; set; }

        public virtual Store Store { get; set; }

    }
}
