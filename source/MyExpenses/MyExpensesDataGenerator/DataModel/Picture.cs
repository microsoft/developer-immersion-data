namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Expense.Picture")]
    public partial class Picture
    {
        public int Id { get; set; }

        public short PictureType { get; set; }

        public int EmployeeId { get; set; }

        [Required]
        public byte[] Content { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
