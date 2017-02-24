namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Expense.Bonification")]
    public partial class Bonification
    {
        public int Id { get; set; }

        public double Amount { get; set; }

        public bool Enabled { get; set; }

        [Required]
        [StringLength(200)]
        public string Description { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime From { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime To { get; set; }

        public int EmployeeId { get; set; }

        public short ExpenseCategoryId { get; set; }

        public virtual Employee Employee { get; set; }

        public virtual Employee Employee1 { get; set; }

        public virtual ExpenseCategory ExpenseCategory { get; set; }
    }
}
