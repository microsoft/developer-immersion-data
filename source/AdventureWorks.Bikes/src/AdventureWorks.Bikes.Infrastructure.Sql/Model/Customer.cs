
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Model
{
    public class Customer
    {
        public int CustomerId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string ZipCode { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Country { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string CreditCardNumber { get; set; }

        public DateTime RegistrationDate { get; set; }

        public DateTime LastOrder { get; set; }

        [NotMapped]
        public int Sales { get; set; }
        
        public virtual ICollection<Order> Orders { get; set; }

    }
}
