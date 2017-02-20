
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using System;

namespace AdventureWorks.Bikes.API.ViewModels
{
    public class CustomerDetailViewModel
    {
        public CustomerDetailViewModel(Customer customer)
        {
            if (customer != null)
            {
                CustomerId = customer.CustomerId;
                FirstName = customer.FirstName;
                LastName = customer.FirstName;
                RegistrationDate = customer.RegistrationDate;
                LastOrder = customer.LastOrder;
                Address = customer.Address;
                ZipCode = customer.ZipCode;
                City = customer.City;
                Country = customer.Country;
                Phone = customer.Phone;
                Email = customer.Email;
                CreditCardNumber = customer.CreditCardNumber;
            }
        }

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
    }
}
