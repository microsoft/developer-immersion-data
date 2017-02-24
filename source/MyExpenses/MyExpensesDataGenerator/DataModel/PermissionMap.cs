using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyExpensesDataGenerator
{
    [Table("Expense.PermissionMap")]
    public partial class PermissionMap
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public byte[] Email { get; set; }

        public int TeamId { get; set; }

        public bool isTeamManager { get; set; }

        public virtual Team Team { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
