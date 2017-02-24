namespace MyExpensesDataGenerator
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class MyExpenseDataContext : DbContext
    {
        public MyExpenseDataContext()
            : base("name=MyExpensesDataModel")
        {
            Database.SetInitializer<MyExpenseDataContext>(null);
        }

        public MyExpenseDataContext(string connectionString)
            : base(connectionString)
        {
            Database.SetInitializer<MyExpenseDataContext>(null);
        }

        public virtual DbSet<ProductCategory> ProductCategories { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Bonification> Bonifications { get; set; }
        public virtual DbSet<CostCenter> CostCenters { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<ExpenseBonus> ExpenseBonus { get; set; }
        public virtual DbSet<ExpenseCategory> ExpenseCategories { get; set; }
        public virtual DbSet<ExpenseReport> ExpenseReports { get; set; }
        public virtual DbSet<Expense> Expenses { get; set; }
        public virtual DbSet<Picture> Pictures { get; set; }
        public virtual DbSet<SuspiciousExpense> SuspiciousExpenses { get; set; }
        public virtual DbSet<Team> Teams { get; set; }
        public virtual DbSet<AccountMovement> AccountMovements1 { get; set; }
        public virtual DbSet<BuyerCategory> BuyerCategories { get; set; }
        public virtual DbSet<EmployeePurchase> EmployeePurchases { get; set; }
        public virtual DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public virtual DbSet<PermissionMap> PermissionMap { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductCategory>()
                .HasMany(e => e.Products)
                .WithRequired(e => e.ProductCategory)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Product>()
                .HasMany(e => e.PurchaseOrderItems)
                .WithRequired(e => e.Product)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Bonifications)
                .WithRequired(e => e.Employee)
                .HasForeignKey(e => e.EmployeeId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Bonifications1)
                .WithRequired(e => e.Employee1)
                .HasForeignKey(e => e.EmployeeId);

            modelBuilder.Entity<Employee>()
                .HasOptional(e => e.EmployeePurchase)
                .WithRequired(e => e.Employee);

            modelBuilder.Entity<ExpenseReport>()
                .Property(e => e.VersionTimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Expense>()
                .HasMany(e => e.ExpenseBonus)
                .WithRequired(e => e.Expens)
                .HasForeignKey(e => e.ExpenseId);

            modelBuilder.Entity<Expense>()
                .HasMany(e => e.SuspiciousExpenses)
                .WithRequired(e => e.Expens)
                .HasForeignKey(e => e.SuspiciousExpenseId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<BuyerCategory>()
                .HasMany(e => e.EmployeePurchases)
                .WithRequired(e => e.BuyerCategory)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<EmployeePurchase>()
                .HasMany(e => e.AccountMovements1)
                .WithRequired(e => e.EmployeePurchase)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<EmployeePurchase>()
                .HasMany(e => e.PurchaseOrders)
                .WithRequired(e => e.EmployeePurchase)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<PurchaseOrder>()
                .HasMany(e => e.PurchaseOrderItems)
                .WithRequired(e => e.PurchaseOrder)
                .HasForeignKey(e => e.PurchaseHistoryId);
        }
    }
}
