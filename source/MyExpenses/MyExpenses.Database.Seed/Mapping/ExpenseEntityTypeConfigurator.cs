namespace MyCompany.Expenses.Data.Infrastructure.Mapping
{
    using MyCompany.Expenses.Model;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    /// <summary>
    /// The entity type configuration
    /// </summary>
    class ExpenseEntityTypeConfigurator
        : EntityTypeConfiguration<Expense>
    {
        private ExpenseEntityTypeConfigurator()
        {
            this.HasKey(e => e.ExpenseId);

            this.Property(e => e.Name)
                .IsRequired();

            this.Property(e => e.Description)
                .IsRequired();

            this.Property(e => e.Description)
                .HasMaxLength(500);

            this.Property(e => e.ExpenseType)
                .IsRequired();

            this.Property(e => e.Amount)
                .IsRequired();

            this.Property(e => e.EmployeeId)
                .IsRequired();

            this.Property(e => e.CreationDate)
                .IsRequired();

            this.Property(e => e.LastModifiedDate)
                .IsRequired();

            this.Property(e => e.Status)
                .IsRequired();

            this.HasOptional(t => t.ExpenseTravel)
                .WithRequired(t => t.Expense)
                .WillCascadeOnDelete(true);
        }
    }
}
