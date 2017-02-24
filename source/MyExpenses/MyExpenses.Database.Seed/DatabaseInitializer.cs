namespace MyExpenses.Database.Seed
{

    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Configuration;
    using System.Collections.Specialized;
    using MyCompany.Expenses.Model;

    /// <summary>
    /// The default initializer for testing . You can learn more about initializers in 
    /// http://msdn.microsoft.com/en-us/library/gg696323(v=VS.103).aspx
    /// </summary>
    public class DatabaseInitializer
        : DropCreateDatabaseIfModelChanges<MyCompanyContext>
    {
        private static readonly Random _randomize = new Random();
        private static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
        private string _picturePath = "FakeImages\\{0}.jpg";
        private string _smallPicturePath = "FakeImages\\{0} - small.jpg";

        private List<string> _employeeEmails;
        private List<string> _employeeNames = new List<string>()
        {
            "Demetria Hood",
            "Venus Norton",
            "Ashely Randall",
            "Bethany Cotton",
            "Kenyon Armstrong",
            "Alvin Suarez",
            "Cooper Nunez",
            "Althea Pruitt",
            "Damon Cain",
            "Ian Christensen",
            "Macy Christian",
            "Martena Coffey",
            "Isaac Hodge",
            "Gemma Foley",
            "Kevin Hensley",
            "Hop Ball",
            "Nathaniel Hester",
            "Todd Livingston",
            "Reese Zamora",
            "Hiroko Adams",
            "Freya Burch",
            "Bo Trujillo",
            "Kirsten Collier",
            "Keely Merrill",
            "Moses Horne",
            "Sarah Sosa",
            "Jasper Mcgee",
            "Jared Woodward",
            "Basia Armstrong",
            "Eaton Bradley",
            "Ramona Clarke",
            "Fiona Goodwin",
            "Idola Mcintosh",
            "Timothy Russell",
            "Sara Roberson",
            "Remedios House",
            "Dora Burt",
            "Quynn Hyde",
            "Quinn Mcguire",
            "Neville Parrish",
            "Benedict Hodges",
            "Addison Barrera",
            "Selma Williams",
            "Bo Boyer",
            "Celeste Walsh",
            "Clark Daniels",
            "Ivor Mccarty",
            "Victor Burnett",
            "Jana Odonnell",
            "Adele Henry",
            "Arthur Bryan",
            "Montana Best",
            "Karyn Head",
            "Amanda Hensley",
            "Genevieve Lindsey",
            "Sheila Knox",
            "Cade Pratt",
            "Tate Maddox",
            "Eaton Barlow",
            "Stuart Figueroa",
            "Solomon Mcknight",
            "Julie Mcmillan",
            "Benjamin Chandler",
            "Kyra Mccray",
            "Preston Gay",
            "Xyla Trevino",
            "Melvin Gutierrez",
            "Brynn George",
            "Russell Villarreal",
            "Lareina Chase",
            "Avram Fuller",
            "Tanner Joseph",
            "Bert Pacheco",
            "Steven Hart",
            "Arden Wilkerson",
            "Shana Thompson",
            "Yoko Bradshaw",
            "Ria Ball",
            "Erasmus Parrish",
            "Kelsie Dale",
            "Beatrice Orr",
            "Dean Durham",
            "Jordan Branch",
            "Emmanuel Dillon",
            "Tamara Osborn",
            "Germane Webster",
            "Edward Harmon",
            "Alfonso Ball",
            "Danielle Oconnor",
            "Joelle Morrow",
            "Ali Mccall",
            "Debra Morrow",
            "Warren Dickerson",
            "Joshua West",
            "Jesse Mooney",
            "Lamar Cline",
            "Clio Greer",
            "Astra Ramirez",
            "Mechelle Spears",
            "Sylvia Caldwell"
        };

        public void Populate(MyCompanyContext context)
        {
            Seed(context);
        }

        /// <summary>
        /// Seed
        /// </summary>
        /// <param name="context"></param>
        protected override void Seed(MyCompanyContext context)
        {
            FillEmployeeEmails();
            CreateTeamManagers(context);
            CreateEmployees(context);
            //CreateEmployeePictures(context);
            CreateExpenses(context);
        }

        private void FillEmployeeEmails()
        {
            _employeeEmails = new List<string>();
            foreach (var name in _employeeNames)
            {
                var email = string.Concat(name.Replace(' ', '.'), $"@{tenant}");
                _employeeEmails.Add(email);
            }
        }

        private void CreateTeamManagers(MyCompanyContext context)
        {
            int managersCount = _employeeNames.Count() / 8;

            for (int i = 0; i < managersCount; i++)
            {
                int id = i + 1;
                var name = _employeeNames[i];
                var split = name.Split(' ');
                context.Employees.Add(new Employee()
                {
                    EmployeeId = id,
                    FirstName = split[0],
                    LastName = split[1],
                    Email = _employeeEmails[i],
                    JobTitle = "Team Lead",
                });

                context.Teams.Add(new Team() { TeamId = id, ManagerId = id });
            }

            context.SaveChanges();
        }

        private void CreateEmployees(MyCompanyContext context)
        {
            int initialId = context.Employees.Count() + 1;
            int employeesCount = _employeeEmails.Count + 1;

            int totalTeams = context.Teams.Count();

            for (int i = initialId; i < employeesCount; i++)
            {
                int index = i - 1;
                var name = _employeeNames[index];

                var split = name.Split(' ');
                context.Employees.Add(new Employee()
                {
                    EmployeeId = i,
                    FirstName = split[0],
                    LastName = split[1],
                    Email = _employeeEmails[index],
                    JobTitle = GetPosition(i),
                    TeamId = context.Teams.First(t => t.TeamId == (index % totalTeams) + 1).TeamId
                });
            }

            context.SaveChanges();
        }

        private void CreateEmployeePictures(MyCompanyContext context)
        {
            int employeePictureId = 1;

            foreach (var employee in context.Employees)
            {
                string employeeName = string.Format("{0} {1}", employee.FirstName, employee.LastName);
                string path = string.Format(_smallPicturePath, employeeName);
                context.EmployeePictures.Add(new EmployeePicture()
                {
                    EmployeePictureId = employeePictureId,
                    EmployeeId = employee.EmployeeId,
                    PictureType = PictureType.Small,
                    Content = GetPicture(path)
                });
                employeePictureId++;

                path = string.Format(_picturePath, employeeName);
                context.EmployeePictures.Add(new EmployeePicture()
                {
                    EmployeePictureId = employeePictureId,
                    EmployeeId = employee.EmployeeId,
                    PictureType = PictureType.Big,
                    Content = GetPicture(path)
                });
                employeePictureId++;
            }

            context.SaveChanges();
        }

        void CreateExpenses(MyCompanyContext context)
        {
            foreach (var employee in context.Employees)
            {
                int expensesCount = _randomize.Next(0, 10);

                for (int i = 0; i < expensesCount; i++)
                {
                    var expense = GenerateExpense(employee, isSuspect());

                    expense.Name = GetExpenseName(expense.ExpenseType);
                    expense.Picture = GetExpensePicture();
                    if (expense.ExpenseType == ExpenseType.Travel)
                        CreateRoute(context, expense);

                    context.Expenses.Add(expense);
                }
            }

            context.SaveChanges();
        }

        private Expense GenerateExpense(Employee employee, bool isSuspect)
        {
            int days = _randomize.Next(-10, -1);
            var expenseType = GetExpenseType();
            int expenseAmount = GetExpenseAmount(expenseType, isSuspect);

            var expense = new Expense()
            {
                Description = string.Empty,
                CreationDate = DateTime.UtcNow.AddDays(days),
                LastModifiedDate = DateTime.UtcNow,
                Status = GetStatus(),
                Amount = expenseAmount,
                Contact = "Jeff Phillips",
                ExpenseType = expenseType,
                RelatedProject = "MyCompany",
                EmployeeId = employee.EmployeeId,
            };

            return expense;
        }

        private int GetExpenseAmount(ExpenseType expenseType, bool isSuspect)
        {
            int expenseAmount = 0;
            switch (expenseType)
            {
                case ExpenseType.Accommodation:
                    expenseAmount = isSuspect ? _randomize.Next(2000, 8000) : _randomize.Next(50, 1000);
                    break;
                case ExpenseType.Food:
                    expenseAmount = isSuspect ? _randomize.Next(200, 400) : _randomize.Next(1, 40);
                    break;
                case ExpenseType.Travel:
                    expenseAmount = isSuspect ? _randomize.Next(1500, 8000) : _randomize.Next(150, 800);
                    break;
                case ExpenseType.Other:
                    expenseAmount = isSuspect ? _randomize.Next(600, 1500) : _randomize.Next(1, 200);
                    break;
            }

            return expenseAmount;
        }

        private bool isSuspect()
        {
            return _randomize.Next(100) <= 5;
        }

        private static void CreateRoute(MyCompanyContext context, Expense expense)
        {
            var split = expense.Name.Split(' ');
            context.ExpenseTravels.Add(new ExpenseTravel()
            {
                Expense = expense,
                Distance = _randomize.Next(50, 1000),
                From = split[0],
                To = split[2]
            });
        }

        private static string GetCity()
        {
            List<string> cities = new List<string>() {
                "Denver",
                "Irving",
                "Seattle",
                "Tampa",
                "Los Angeles",
                "Portland",
                "Oklahoma City",
                "Atlanta",
                "Cleveland",
                "Tulsa",
                "Buffalo",
                "Orlando",
                "Salt Lake City",
                "Ontario",
                "Springfield",
                "Pasadena",
                "Kent"
            };
            int index = _randomize.Next(0, cities.Count);
            return cities[index];
        }

        private static string GetFood()
        {
            List<string> foods = new List<string>() {
                "Lunch",
                "Dinner",
                "Coffee",
                "Breakfast"
            };
            int index = _randomize.Next(0, foods.Count);
            return foods[index];
        }

        private static ExpenseStatus GetStatus()
        {
            List<ExpenseStatus> status = new List<ExpenseStatus>() {
                ExpenseStatus.Pending,
                ExpenseStatus.Approved,
                ExpenseStatus.Denied,
            };

            int index = _randomize.Next(0, status.Count);
            return status[index];
        }

        private static ExpenseType GetExpenseType()
        {
            List<ExpenseType> types = new List<ExpenseType>() {
                ExpenseType.Food,
                ExpenseType.Accommodation,
                ExpenseType.Travel,
                ExpenseType.Other
            };

            int index = _randomize.Next(0, types.Count);
            return types[index];
        }

        private static string GetExpenseName(ExpenseType type)
        {
            switch (type)
            {
                case ExpenseType.Travel:
                    return string.Format("{0} to {1}", GetCity(), GetCity());
                case ExpenseType.Food:
                    return GetFood();
                case ExpenseType.Accommodation:
                    return "Hotel";
                case ExpenseType.Other:
                    return "Other";
            }

            return string.Empty;
        }

        private static byte[] GetPicture(string filename)
        {
            string path = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.FullName;
            FileStream fs = new FileStream(Path.Combine(path, filename), FileMode.Open, FileAccess.Read);

            using (BinaryReader br = new BinaryReader(fs))
            {
                return br.ReadBytes((int)fs.Length);
            }
        }

        private static byte[] GetExpensePicture()
        {
            string path = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.FullName;
            FileStream fs = new FileStream(Path.Combine(path, GetExpensePicturePath()), FileMode.Open, FileAccess.Read);

            using (BinaryReader br = new BinaryReader(fs))
            {
                return br.ReadBytes((int)fs.Length);
            }
        }

        private static string GetExpensePicturePath()
        {
            List<string> photos = new List<string>() {
                "FakeExpenses\\expense01.jpg",
            };
            int index = _randomize.Next(0, photos.Count);
            return photos[index];
        }

        private static string GetPosition(int index)
        {
            List<string> positions = new List<string>() {
                "Development advisor",
                "Software engineer",
                "Frontend developer",
                "Backend developer",
            };

            return index / 3 < positions.Count ? positions[index / 3] : positions[0];
        }
    }
}
