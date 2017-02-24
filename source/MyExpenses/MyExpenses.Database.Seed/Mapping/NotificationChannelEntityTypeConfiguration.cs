namespace MyCompany.Expenses.Data.Infraestructure.Mapping
{
    using MyCompany.Expenses.Model;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    /// <summary>
    /// The entity type configuration
    /// </summary>
    class NotificationChannelEntityTypeConfiguration
        : EntityTypeConfiguration<NotificationChannel>
    {
        private NotificationChannelEntityTypeConfiguration()
        {
            this.HasKey(e => e.NotificationChannelId);

            this.Property(e => e.ChannelUri)
                .IsRequired();

            this.Property(e => e.NotificationType)
                .IsRequired();

            this.Property(e => e.EmployeeId)
                .IsRequired();

        }
    }
}
