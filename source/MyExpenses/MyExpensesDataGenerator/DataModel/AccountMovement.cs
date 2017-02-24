namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Purchase.AccountMovement")]
    public partial class AccountMovement
    {
        public int Id { get; set; }

        public double Movement { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime MovementDate { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        public int EmployeeId { get; set; }

        public virtual EmployeePurchase EmployeePurchase { get; set; }
    }
}
