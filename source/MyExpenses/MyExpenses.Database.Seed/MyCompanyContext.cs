namespace MyExpenses.Database.Seed
{
    using System.Data.Entity;
    using MyCompany.Expenses.Model;


    /// <summary>
    /// Context to access to MyCompany entities
    /// </summary>
    public class MyCompanyContext : DbContext
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public MyCompanyContext()
            : base("MyCompany.Expenses")
        {
            Database.Log = (s) =>
            {
                
            };
        }

        #region DbContext Overrides

        /// <summary>
        /// This method is called when the model for a derived context has been initialized,
        /// but before the model has been locked down and used to initialize the context
        /// </summary>
        /// <param name="modelBuilder">The builder that defines the model for the context being created</param>
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //add custom conventions
          

            //Add all entity type configurations defined in "this" assembly. With this
            //method the boilerplate code to add configurations is removed.
            modelBuilder.Configurations.AddFromAssembly(typeof(MyCompanyContext).Assembly);
        }

        #endregion

        #region IDbSet Members

        /// <summary>
        /// Employee Collection
        /// </summary>
        /// <value>
        /// The employees.
        /// </value>
        public DbSet<Employee> Employees { get; set; }


        /// <summary>
        /// Team Collection
        /// </summary>
        /// <value>
        /// The teams.
        /// </value>
        public DbSet<Team> Teams { get; set; }

        /// <summary>
        /// Expense Collection
        /// </summary>
        /// <value>
        /// The expenses.
        /// </value>
        public DbSet<Expense> Expenses { get; set; }

        /// <summary>
        /// Office Collection
        /// </summary>
        /// <value>
        /// The expense travels.
        /// </value>
        public DbSet<ExpenseTravel> ExpenseTravels { get; set; }

        /// <summary>
        /// Employee Picture Collection
        /// </summary>
        /// <value>
        /// The employee pictures.
        /// </value>
        public DbSet<EmployeePicture> EmployeePictures { get; set; }

        /// <summary>
        /// Gets or sets the notification channels.
        /// </summary>
        /// <value>
        /// The notification channels.
        /// </value>
        public DbSet<NotificationChannel> NotificationChannels { get; set; }

        /// <summary>
        /// IssuingAuthorityKeys
        /// </summary>
        public DbSet<IssuingAuthorityKey> IssuingAuthorityKeys { get; set; }

        #endregion
    }
}
