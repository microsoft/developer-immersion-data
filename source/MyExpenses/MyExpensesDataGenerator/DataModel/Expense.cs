namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Expense.Expense")]
    public partial class Expense
    {


        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Expense()
        {
            ExpenseBonus = new HashSet<ExpenseBonus>();
            SuspiciousExpenses = new HashSet<SuspiciousExpense>();
        }

        public Expense(string title, double amount, DateTime dateTime, ExpenseCategory expenseCategory)
        {
            ExpenseBonus = new HashSet<ExpenseBonus>();
            Title = title;
            Amount = amount;
            ExpenseCategory = expenseCategory;
            ExpenseCategoryId = expenseCategory.Id;
            Date = dateTime;

            SuspiciousExpenses = new HashSet<SuspiciousExpense>();
        }

        public int Id { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? EnabledFrom { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? EnabledTo { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [StringLength(250)]
        public string Notes { get; set; }

        public double Amount { get; set; }

        public int ExpenseReportId { get; set; }

        public short ExpenseCategoryId { get; set; }

        public byte[] ReceiptPicture { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime Date { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ExpenseBonus> ExpenseBonus { get; set; }

        public virtual ExpenseCategory ExpenseCategory { get; set; }

        public virtual ExpenseReport ExpenseReport { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SuspiciousExpense> SuspiciousExpenses { get; set; }
    }
}
