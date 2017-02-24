namespace MyCompany.Expenses.Data.Infraestructure.Mapping
{
    using MyCompany.Expenses.Model;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    /// <summary>
    /// The entity type configuration
    /// </summary>
    class ExpenseTravelEntityTypeConfiguration
        : EntityTypeConfiguration<ExpenseTravel>
    {
        private ExpenseTravelEntityTypeConfiguration()
        {
            this.HasKey(e => e.ExpenseId);

            this.Property(e => e.ExpenseId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(e => e.Distance)
                .IsRequired();

            this.Property(e => e.From)
                .IsRequired();

            this.Property(e => e.To)
                .IsRequired();

        }
    }
}
