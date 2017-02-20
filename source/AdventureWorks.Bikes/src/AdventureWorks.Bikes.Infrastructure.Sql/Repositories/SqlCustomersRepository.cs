using AdventureWorks.Bikes.Infrastructure.Sql.Context;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using AdventureWorks.Bikes.Infrastructure.Sql.Helpers;
using System.Data.SqlClient;

namespace AdventureWorks.Bikes.Infrastructure.Sql.Repositories
{
    public class SqlCustomersRepository
    {
        BikesContext _context;
        private static readonly Random Randomize = new Random();

        public SqlCustomersRepository(BikesContextBuilder contextBuilder)
        {
            _context = contextBuilder.Create();
        }

        public async Task<Customer> GetAsync(int id)
        {
            return await _context.Customers
                .SingleOrDefaultAsync(c => c.CustomerId == id);
        }

        public async Task<IEnumerable<Customer>> GetAllAsync(int pageSize, int pageCount)
        {
            return await _context.Customers
                .OrderBy(d => d.LastName)
                .Skip(pageSize * pageCount)
                .Take(pageSize)
                .Select(c => new Customer()
                {
                    CustomerId = c.CustomerId,
                    LastName = c.LastName,
                    FirstName = c.FirstName,
                    CreditCardNumber = c.CreditCardNumber,
                    Email = c.Email,
                    RegistrationDate = c.RegistrationDate,
                    LastOrder = c.LastOrder,
                    Sales = Randomize.Next(1, 200) // TODO: Calculate the real value.
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<Customer>> GetCustomersByName(string name)
        {
            List<Customer> customers = new List<Customer>();
            using (SqlConnection conn = new SqlConnection(_context.Database.GetDbConnection().ConnectionString))
            {
                string sql = String.Empty;
                // This is BAD code. You should never parametrize SQL queries like this.
                // It is coded like this for the sake of the guide.
                sql = $"SELECT * FROM dbo.Customers WHERE FirstName = '{name}'";
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.CommandTimeout = 30;
                    conn.Open();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (reader.Read())
                    {
                        customers.Add(new Customer()
                        {
                            CustomerId = (int)reader["CustomerId"],
                            LastName = (string)reader["LastName"],
                            FirstName = (string)reader["FirstName"],
                            Email = (string)reader["Email"],
                            RegistrationDate = (DateTime)reader["RegistrationDate"],
                            LastOrder = (DateTime)reader["LastOrder"],
                            Sales = Randomize.Next(1, 200)
                        });
                    }
                }
                return customers;
            }
        }

    }
}
