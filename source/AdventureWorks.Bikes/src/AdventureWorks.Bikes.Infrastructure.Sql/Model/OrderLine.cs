
namespace AdventureWorks.Bikes.Infrastructure.Sql.Model
{
    public class OrderLine
    {
        public int OrderLineId { get; set; }

        public int ProductId { get; set; }

        public virtual Product Product { get; set; }

        public int NumberOfUnits { get; set; }

        public decimal PricePerUnit { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal Amount { get; set; }

        public int OrderId { get; set; }

        public virtual Order Order { get; set; }

    }
}
