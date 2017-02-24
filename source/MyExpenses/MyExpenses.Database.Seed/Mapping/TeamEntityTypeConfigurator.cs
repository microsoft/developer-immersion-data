namespace MyCompany.Expenses.Data.Infrastructure.Mapping
{
    using MyCompany.Expenses.Model;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;


    /// <summary>
    /// The entity type configuration
    /// </summary>
    class TeamEntityTypeConfigurator
        : EntityTypeConfiguration<Team>
    {
        private TeamEntityTypeConfigurator()
        {
            this.HasKey(t => t.TeamId);

            this.Property(t => t.TeamId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.HasRequired(t => t.Manager)
                .WithMany(d => d.ManagedTeams)
                .HasForeignKey(t => t.ManagerId);
        }
    }
}
