namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Purchase.BuyerCategory")]
    public partial class BuyerCategory
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public BuyerCategory()
        {
            EmployeePurchases = new HashSet<EmployeePurchase>();
        }

        public short Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public double MaxPointsInFiscalYear { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EmployeePurchase> EmployeePurchases { get; set; }
    }
}
