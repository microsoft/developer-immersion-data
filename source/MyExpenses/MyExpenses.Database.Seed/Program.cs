using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyExpenses.Database.Seed
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Creating employees and expenses data...");
            MyCompanyContext context = new MyCompanyContext();
            var seed = new DatabaseInitializer();
            seed.InitializeDatabase(context);
            seed.Populate(context); // This will fail the first time DB is created or when the model changes, due to the initializer.
        }
    }
}
