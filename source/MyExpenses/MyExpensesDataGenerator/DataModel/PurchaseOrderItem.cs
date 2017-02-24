namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Purchase.PurchaseOrderItem")]
    public partial class PurchaseOrderItem
    {
        public int Id { get; set; }

        public int PurchaseHistoryId { get; set; }

        public int ProductId { get; set; }

        [Required]
        [StringLength(50)]
        public string ProductName { get; set; }

        public double Price { get; set; }

        public int ItemsNumber { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime PurchaseDate { get; set; }

        public virtual Product Product { get; set; }

        public virtual PurchaseOrder PurchaseOrder { get; set; }
    }
}
