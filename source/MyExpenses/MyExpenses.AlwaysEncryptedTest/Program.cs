namespace MyExpenses.AlwaysEncryptedTest
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "Data Source=E1SZZYBDRD3GA4Q.northeurope.cloudapp.azure.com; Initial Catalog=Expenses; User Id=experience1; Password=P2ssw0rd; Column Encryption Setting=enabled";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand cmd = connection.CreateCommand())
                {

                    cmd.CommandText = @"SELECT * FROM [Expense].[Employee] WHERE BankAccountNumber=@BankAccountNumber";
                    SqlParameter paramBankAccountNumber = cmd.CreateParameter();
                    paramBankAccountNumber.ParameterName = @"@BankAccountNumber";
                    paramBankAccountNumber.DbType = DbType.String;
                    paramBankAccountNumber.Direction = ParameterDirection.Input;
                    paramBankAccountNumber.Value = "03534343437867564987904";
                    paramBankAccountNumber.Size = 17;
                    cmd.Parameters.Add(paramBankAccountNumber);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            //while (reader.Read())
                            //{
                            //    Console.WriteLine(@"{0}, {1}, {2}, {3}", reader[0], reader[1], reader[2], ((DateTime)reader[3]).ToShortDateString());
                            //}
                        }
                    }
                }
            }
        }
    }
}
