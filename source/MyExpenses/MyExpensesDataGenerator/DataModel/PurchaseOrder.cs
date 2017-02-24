namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Purchase.PurchaseOrder")]
    public partial class PurchaseOrder
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PurchaseOrder()
        {
            PurchaseOrderItems = new HashSet<PurchaseOrderItem>();
        }

        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public virtual EmployeePurchase EmployeePurchase { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PurchaseOrderItem> PurchaseOrderItems { get; set; }
    }
}
