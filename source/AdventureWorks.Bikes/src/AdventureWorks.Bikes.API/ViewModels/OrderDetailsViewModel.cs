using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using AdventureWorks.Bikes.Infrastructure.Sql.Model.Enums;
using System;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class OrderDetailsViewModel
    {
        public OrderDetailsViewModel(Order order)
        {
            if (order != null)
            {
                OrderId = order.OrderId;
                TotalPrice = order.TotalPrice;
                Date = order.Date;
                Status = order.Status;
                Customer = order.Customer != null ? $"{order.Customer.FirstName} {order.Customer.LastName}" : string.Empty;
                Status = order.Status;
                Comments = order.Comments;
                StoreId = order.StoreId;
                CustomerId = order.CustomerId;
                Status = order.Status;
            }
        }

        public int OrderId { get; set; }

        public decimal TotalPrice { get; private set; }

        public string Comments { get; set; }

        public DateTime Date { get; set; }

        public Status Status { get; set; }

        public int StoreId { get; set; }

        public string Customer { get; set; }

        public int CustomerId { get; set; }
    }
}
