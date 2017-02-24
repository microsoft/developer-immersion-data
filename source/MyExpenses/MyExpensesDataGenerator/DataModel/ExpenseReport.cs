namespace MyExpensesDataGenerator
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Expense.ExpenseReport")]
    public partial class ExpenseReport
    {




        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ExpenseReport()
        {
            Expenses = new HashSet<Expense>();
        }

        public ExpenseReport(string purpose, string description, CostCenter costCenter, Employee employee)
        {

            Expenses = new HashSet<Expense>();
            Purpose = purpose;
            Description = description;
            CostCenter = costCenter;
            CostCenterId = costCenter.Id;
            Employee = employee;
        }

        public int Id { get; set; }

        public short CostCenterId { get; set; }

        [Required]
        [StringLength(250)]
        public string Purpose { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime CreatedOn { get; set; }

        public int EmployeeId { get; set; }

        public short Status { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string SequenceNumber { get; set; }

        [StringLength(250)]
        public string Summary { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? SubmissionDate { get; set; }

        public bool ReimburseInPoints { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] VersionTimeStamp { get; set; }

        public virtual CostCenter CostCenter { get; set; }

        public virtual Employee Employee { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Expense> Expenses { get; set; }

        public void ReimburseWithPoints()
        {
            if (Status != 2
                &&
                Status != 3)
            {
                this.ReimburseInPoints = true;
            }



        }

        public void SubmitForApproval()
        {
            if (Status == 0)
            {
                SubmissionDate = DateTime.UtcNow;
                Status = 1;
            }

        }

        public void Approve(Employee manager)
        {
            if (manager.IsTeamManager
                &&
                manager.Team == this.Employee.Team)
            {
                if (Status == 1)
                {
                    Status = 4;

                    Summary = "Approved";

                }

            }

        }
        public void Reimburse(Employee manager)
        {
            if (manager.IsTeamManager
              &&
              manager.Team == this.Employee.Team)
            {

                if (Status == 4)
                {
                    Status = 2;
                }
                
            }
            
        }
        public void Reject(Employee manager, string rejectReason)
        {
            if (manager.IsTeamManager
               &&
               manager.Team == this.Employee.Team)
            {

                if (Status == 1)
                {
                    Status = 3;

                    Summary = "Rejected";

                }
                
            }
            
        }
    }
}
