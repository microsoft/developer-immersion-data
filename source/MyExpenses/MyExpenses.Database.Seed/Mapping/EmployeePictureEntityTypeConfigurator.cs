namespace MyCompany.Expenses.Data.Infraestructure.Mapping
{
    using MyCompany.Expenses.Model;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    /// <summary>
    /// the entity type configuration for <see cref="MyCompany.Expenses.Model.EmployeePicture"/>
    /// </summary>
    class EmployeePictureEntityTypeConfigurator
        : EntityTypeConfiguration<EmployeePicture>
    {
        private EmployeePictureEntityTypeConfigurator()
        {
            this.HasKey(ep => ep.EmployeePictureId);

            this.Property(ep => ep.EmployeePictureId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.HasRequired(ep => ep.Employee)
                .WithMany(e => e.EmployeePictures)
                .HasForeignKey(e => e.EmployeeId);
        }
    }
}
