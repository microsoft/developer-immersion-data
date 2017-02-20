
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using System;
using System.Collections.Generic;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class CustomerListViewModel
    {
        public CustomerListViewModel(Customer customer)
        {
            if (customer != null)
            {
                CustomerId = customer.CustomerId;
                FirstName = customer.FirstName;
                LastName = customer.FirstName;
                RegistrationDate = customer.RegistrationDate;
                LastOrder = customer.LastOrder;
                Email = customer.Email;
                Sales = customer.Sales;
                CreditCardNumber = customer.CreditCardNumber;
            }
        }

        public int CustomerId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string CreditCardNumber { get; set; }

        public int Sales { get; set; }

        public DateTime RegistrationDate { get; set; }

        public DateTime LastOrder { get; set; }

    }
}
