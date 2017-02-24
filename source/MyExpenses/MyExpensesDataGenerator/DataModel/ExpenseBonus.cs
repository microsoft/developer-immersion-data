namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Expense.ExpenseBonus")]
    public partial class ExpenseBonus
    {
        public int Id { get; set; }

        public double Amount { get; set; }

        [Required]
        [StringLength(250)]
        public string Reason { get; set; }

        public int ExpenseId { get; set; }

        public virtual Expense Expens { get; set; }
    }
}
