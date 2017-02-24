namespace MyExpensesDataGenerator
{
    using System.Data.Entity;
    using System.Data.Entity.SqlServer;

    public class ContextConfiguration : DbConfiguration
    {
        public ContextConfiguration()
        {
            SetExecutionStrategy(SqlProviderServices.ProviderInvariantName, () => new SqlAzureExecutionStrategy());
        }
    }
}
