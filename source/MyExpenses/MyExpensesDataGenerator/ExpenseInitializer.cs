

using Microsoft.SqlServer.Management.Common;
using Microsoft.SqlServer.Management.Smo;
using MyExpensesDataGenerator;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Migrations;
using System.Data.SqlClient;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using EntityFramework.BulkInsert.Extensions;
using System.Security.Cryptography.X509Certificates;
using System.Diagnostics;

public static class ExpenseInitializer
{
    private static Random _randomize = new Random();
    private const string PicturePath = "FakeImages\\Products\\{0}.png";
    private const string SmallPicturePath = "FakeImages\\\\Products\\{0}b.png";
    private const string ReceiptPicturePath = "FakeImages\\receipt.jpg";
    private const string EmployeePicturePath = "FakeImages\\Employees\\{0}.jpg";
    private const string EmployeeSmallPicturePath = "FakeImages\\Employees\\{0}.jpg";
    private const int MAX_EMPLOYEES_TO_PROCESS = 100; // Don't worry if the number is high, 
                                                      // the code takes into account the max number of employees available.
    private const int MAX_MONTHS = 12;
    private const int MAX_EXPENSES_PER_MONTH = 8; // At least 5

    private static string _baseDirectoryPath;


    private static readonly string[] _teamNames = new string[]
    {
            "Development",
            "Human Resources"
    };


    public static void Initialize()
    {
        var expensesContext = new MyExpenseDataContext();

        if (expensesContext.Database.Exists())
        {
            return;
        }

        SetBaseDirectoryPath();

        var isSecondExperience = bool.Parse(ConfigurationManager.AppSettings["IsSecondExperience"]);

        if (isSecondExperience)
        {
            CreateSecondExperience(expensesContext);
        }
        else
        {
            CreateFirstExperience(expensesContext);
        }
    }

    private static void CreateFirstExperience(MyExpenseDataContext expensesContext)
    {
        var connectionString = expensesContext.Database.Connection.ConnectionString;

        var stopWatch = new Stopwatch();

        stopWatch.Start();

        //var begin = Task.Run(() =>
        //{
            var context = new MyExpenseDataContext();

            ExecuteScript(connectionString, "ExpensesDatabaseScript.sql");
            PopulateData(context, connectionString, "Expenses");
        //});

        //var end = Task.Run(() =>
      //{
          var expensesEndContext = new MyExpenseDataContext(connectionString.Replace("Expenses", "Expenses.End"));
          var endConnectionString = expensesEndContext.Database.Connection.ConnectionString;

          ExecuteScript(endConnectionString, "ExpensesEndDatabaseScript.sql", "Expenses.End");
          PopulateData(expensesEndContext, endConnectionString, "Expenses.End");
          ExecuteScript(endConnectionString, "UpgradeEndDatabase.sql", "Expenses.End");
      //});

        //Task.WaitAll(begin, end);


        stopWatch.Stop();

        CreateDataWarehouse(connectionString);
    }

    private static void CreateSecondExperience(MyExpenseDataContext expensesContext)
    {
        var connectionString = expensesContext.Database.Connection.ConnectionString;

        ExecuteScript(connectionString, "ExpensesDatabaseScript.sql");
        PopulateData(expensesContext, connectionString, "Expenses");
        ExecuteScript(connectionString, @"Experience2\UpgradeDatabase.sql", "Expenses");

        ExecuteScript(connectionString, @"Experience2\DWHDatabaseScript.sql");
        ExecuteScript(connectionString, @"Experience2\DWHPopulateDataScript.sql");
    }

    private static void PopulateData(MyExpenseDataContext context, string connectionString, string databaseName)
    {
       
        CreateTeams(context);
        CreateEmployees(context);
        CreateEmployeePictures(context);
        CreatePermissions(connectionString, databaseName);
        CreateExpenseCategories(context);
        CreateCostCenters(context);
        CreateExpensesReports(context);


        // Catalog seed
        CreateProductCategories(context);
        CreateProducts(context);

        //Buyer data
        CreateBuyerData(context);
    }

    private static void CreateDataWarehouse(string connectionString)
    {
        // Working DWH
        ExecuteScript(connectionString, "DWHDatabaseScript.sql");
        ExecuteScript(connectionString, "DWHPopulateDataScript.sql");

        // End DWH
        ExecuteScript(connectionString, "DWHEndDatabaseScript.sql");
        ExecuteScript(connectionString, "DWHEndPopulateDataScript.sql");
    }

    private static void ExecuteScript(string connectionString, string scriptFileName, string databaseToReplace = "Expenses", string databaseToConnect = "master")
    {
        var masterConnectionString = connectionString.Replace(databaseToReplace, databaseToConnect);
        using (SqlConnection connection = new SqlConnection(masterConnectionString))
        {
            FileInfo fileInfo = new FileInfo(string.Format(@"Content\{0}", scriptFileName));
            string script = fileInfo.OpenText().ReadToEnd();

            Server server = new Server(new ServerConnection(connection));
            server.ConnectionContext.ExecuteNonQuery(script);
        }
    }

    private static void SetBaseDirectoryPath()
    {
        var assemblyPath = Directory.GetCurrentDirectory();
        _baseDirectoryPath = Path.Combine(assemblyPath, @"Content");
    }

    private static void CreateTeams(MyExpenseDataContext context)
    {
        var teamsToBeAdded = _teamNames
            .Select(n => new Team() { TeamName = n })
            .ToArray();

        context.Teams.AddOrUpdate(teamsToBeAdded);

        context.SaveChanges();
    }

    private static void CreateEmployees(MyExpenseDataContext context)
    {
        var employeesCount = Common.EmployeeEmails.Count;

        var teamOne = context.Teams.OrderBy(t => t.Id).First();
        var teamTwo = context.Teams.OrderByDescending(t => t.Id).First();

        for (var i = 0; i < employeesCount && i < MAX_EMPLOYEES_TO_PROCESS; i++)
        {
            var empleyeData = Common._employeeData[i];

            var split = empleyeData.Item1.Split(' ');

            var firstName = split[0];
            var lastName = split[1];
            var email = Common.EmployeeEmails[i].Item2;
            var identifier = empleyeData.Item2;
            var jobTitle = empleyeData.Item3;

            var employee = new Employee()
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Identifier = identifier,
                JobTitle = jobTitle,
                Pictures = new HashSet<Picture>(),
                Bonifications = new HashSet<Bonification>(),
                IsTeamManager = false,
                BankAccountNumber = RandomDigits(17)
            };
            employee.Team = empleyeData.Item4 == 0 ? teamOne : teamTwo;

            if (employee.JobTitle.Contains("Lead"))
            {
                employee.IsTeamManager = true;
            }

            context.Employees.AddOrUpdate(employee);
        }

        context.SaveChanges();
    }

    public static string RandomDigits(int length)
    {
        var random = new Random();
        string s = string.Empty;
        for (int i = 0; i < length; i++)
            s = String.Concat(s, random.Next(10).ToString());
        return s;
    }

    private static void CreateEmployeePictures(MyExpenseDataContext context)
    {
        int i = 1;
        foreach (var employee in context.Employees)
        {
            var path = string.Format(EmployeeSmallPicturePath, i);

            employee.Pictures.Add(new Picture()
            {
                PictureType = (int)PictureType.Small,
                Content = GetPicture(path)
            });


            path = string.Format(EmployeePicturePath, i);
            employee.Pictures.Add(new Picture()
            {
                PictureType = (int)PictureType.Big,
                Content = GetPicture(path)
            });

            i++;
        }

        context.SaveChanges();
    }

    private static void CreatePermissions(string connectionString, string databaseName)
    {
        ExecuteScript(connectionString, "PopulatePermissions.sql", databaseName, databaseName);
    }

    private static void CreateExpenseCategories(MyExpenseDataContext context)
    {
        var expenseCategoryList = new List<ExpenseCategory>();

        expenseCategoryList.Add(new ExpenseCategory("Accommodation", "Expense related with accommodation", 30));
        expenseCategoryList.Add(new ExpenseCategory("Flights", "Expense related with flights", 30));
        expenseCategoryList.Add(new ExpenseCategory("Highway", "Expense related with highways", 30));
        expenseCategoryList.Add(new ExpenseCategory("Meals", "Expense related with meals", 30));
        expenseCategoryList.Add(new ExpenseCategory("Trains", "Expense related with trains", 30));

        context.ExpenseCategories.AddRange(expenseCategoryList);
        context.SaveChanges();
    }

    private static void CreateCostCenters(MyExpenseDataContext context)
    {
        var madrid = new CostCenter("MADRID");
        madrid.Description = "Cost center related to MADRID office";

        var seattle = new CostCenter("SEATTLE");
        seattle.Description = "Cost center related to SEATTLE office";

        context.CostCenters.AddRange(new[] { madrid, seattle });
        context.SaveChanges();
    }

    private static void CreateExpensesReports(MyExpenseDataContext context)
    {
        int reportNumber = 0;
        var costCenter = context.CostCenters.First();
        var indexedExpenseCategories = context.ExpenseCategories
            .ToDictionary(i => i.Id, i => i);

        var employees = context.Employees.ToList();

        context.Configuration.AutoDetectChangesEnabled = false;
        foreach (var employee in employees)
        {
            var reportsToInsert = new List<ExpenseReport>();

            for (int month = 0; month < MAX_MONTHS; month++)
            {
                var report = GenerateExpenseReport(reportNumber, month, employee, employees, costCenter, indexedExpenseCategories);
                reportsToInsert.Add(report);
                reportNumber++;
            }

            context.ExpenseReports.AddRange(reportsToInsert);

            context.SaveChanges();
        }

        context.Configuration.AutoDetectChangesEnabled = true;

        context.SaveChanges();
    }

    private static ExpenseReport GenerateExpenseReport(int reportNumber, int month,
        Employee employee,
        List<Employee> employees,
        CostCenter costCenter,
        Dictionary<short, ExpenseCategory> indexedExpensesCategories)
    {
        var manager = employees.First(e => e.TeamId == employee.TeamId && e.IsTeamManager);
        int expensesCount = _randomize.Next(1, MAX_EXPENSES_PER_MONTH);
        ExpenseReport report = new ExpenseReport("Report purpose", GetReportDescription(), costCenter, employee);
        for (int i = 0; i < expensesCount; i++)
        {
            // We generate 5% of all the expenses as suspicious expenses.
            bool isSuspiciousExpense = _randomize.Next(100) <= 5;
            int expenseDay = _randomize.Next(-30, -1);
            var expenseCategory = indexedExpensesCategories[(short)_randomize.Next(1, indexedExpensesCategories.Count)];
            var expense = new Expense(expenseCategory.Description, GetExpenseAmount(expenseCategory, isSuspiciousExpense),
                DateTime.UtcNow.AddMonths(-month).AddDays(expenseDay), expenseCategory);
            expense.ExpenseReport = report;

            expense.Notes = "The expense notes";
            expense.ReceiptPicture = GetPicture(ReceiptPicturePath);

            if (expense.ExpenseCategory.Equals("Flights"))
            {
                expense.ExpenseBonus.Add(new ExpenseBonus() { Amount = 10, Reason = "> 10 travels" });
            }

            report.Expenses.Add(expense);
            if (isSuspiciousExpense)
            {
                expense.SuspiciousExpenses.Add(new SuspiciousExpense()
                {
                    Expens = expense,
                    SuspiciousExpenseId = expense.Id
                });
            }
        }

        PromoteReport(reportNumber, report, manager);

        return report;
    }

    private static double GetExpenseAmount(ExpenseCategory category, bool isSuspicious)
    {
        double expenseAmount = 0d;

        switch (category.Title)
        {
            case "Accommodation":
                expenseAmount = isSuspicious ? _randomize.Next(2000, 8000) : _randomize.Next(50, 1000);
                break;
            case "Flights":
                expenseAmount = isSuspicious ? _randomize.Next(2000, 8000) : _randomize.Next(150, 1200);
                break;
            case "Meals":
                expenseAmount = isSuspicious ? _randomize.Next(200, 400) : _randomize.Next(1, 40);
                break;
            case "Highway":
                expenseAmount = isSuspicious ? _randomize.Next(80, 200) : _randomize.Next(10, 30);
                break;
            case "Trains":
                expenseAmount = isSuspicious ? _randomize.Next(600, 1500) : _randomize.Next(50, 200);
                break;
        }

        return expenseAmount;
    }

    private static string GetReportDescription()
    {
        string[] descriptions = new string[] {
            "Training for Contoshop employees",
            "Expenses from the Seattle event",
            "Expenses from the New York event",
            "Expenses from the Atlanta event",
        };
        return descriptions[_randomize.Next(4)];
    }

    private static byte[] GetPicture(string fileName)
    {
        var fs = new FileStream(Path.Combine(_baseDirectoryPath, fileName), FileMode.Open, FileAccess.Read);

        using (var br = new BinaryReader(fs))
        {
            return br.ReadBytes((int)fs.Length);
        }
    }

    private static void PromoteReport(int index, ExpenseReport report, Employee manager)
    {
        if (index % 2 == 0)
        {
            report.ReimburseWithPoints();
        }

        if (index < MAX_EXPENSES_PER_MONTH - 3)
        {
            // Unsubmitted
        }
        else if (index < MAX_EXPENSES_PER_MONTH - 2)
        {
            PromoteToSubmitted(report);
        }
        else if (index < MAX_EXPENSES_PER_MONTH - 1)
        {
            PromoteToApproved(report, manager);
        }
        else if (index < MAX_EXPENSES_PER_MONTH)
        {
            PromoteToRefused(report, manager);
        }
        else
        {
            PromoteToReimbursed(report, manager);
        }
    }

    private static void PromoteToSubmitted(ExpenseReport report)
    {
        report.SubmitForApproval();
    }

    private static void PromoteToApproved(ExpenseReport report, Employee manager)
    {
        report.SubmitForApproval();
        report.Approve(manager);
    }

    private static void PromoteToRefused(ExpenseReport report, Employee manager)
    {
        report.SubmitForApproval();
        report.Reject(manager, "Excesive amount of money. sorry!");
    }

    private static void PromoteToReimbursed(ExpenseReport report, Employee manager)
    {
        report.SubmitForApproval();
        report.Approve(manager);
        report.Reimburse(manager);
    }

    private static void CreateProductCategories(MyExpenseDataContext context)
    {
        var surfaceCategory = new ProductCategory { Title = "Surface" };
        var accesoriesCategory = new ProductCategory { Title = "Accessories" };
        var xboxCategory = new ProductCategory { Title = "Xbox" };
        var lumiaCategory = new ProductCategory { Title = "Lumia" };
        var officeCategory = new ProductCategory { Title = "Office" };
        var windowsCategory = new ProductCategory { Title = "Windows" };

        context.ProductCategories
            .AddRange(new[] { surfaceCategory, accesoriesCategory, xboxCategory, lumiaCategory, officeCategory, windowsCategory });

        context.SaveChanges();
    }

    private static void CreateProducts(MyExpenseDataContext context)
    {
        var categoriesLookup = context.ProductCategories.ToDictionary(category => category.Title);

        var productsData = new[]
        {
            new { Title = "Surface Pro 2", Price = 429.0 , ProductCategoryId = categoriesLookup["Surface"].Id, ImagePrefix = "01", Description = "The power of your PC in a tablet." },
            new { Title = "Forza motorsport 5", Price = 69.99, ProductCategoryId = categoriesLookup["Xbox"].Id, ImagePrefix = "02", Description = "Forza Motorsport, the highest-rated racing franchise of the past 10 years, returns with the definitive next-generation automotive experience, created exclusively for Xbox One."},
            new { Title = "Microsoft Touch Mouse", Price = 79.9, ProductCategoryId = categoriesLookup["Accessories"].Id, ImagePrefix = "03", Description = "Transform the way you work with Windows. Flick to quickly scroll and pan or gesture to zoom or navigate." },
            new { Title = "Xbox 360 Wireless Speed Wheel", Price = 45d, ProductCategoryId = categoriesLookup["Accessories"].Id, ImagePrefix = "04", Description = "With the Xbox 360 Wireless Speed Wheel, you'll experience realistic, accurate steering, and feel every bump in the road with rumble feedback." },
            new { Title = "Xbox One Play & Charge Kit", Price = 39.99, ProductCategoryId = categoriesLookup["Accessories"].Id, ImagePrefix = "05", Description = "Complete with a charging cable and rechargeable battery pack, the Xbox One Play and Charge Kit is all you need to juice up your Xbox One wireless controller." },
            new { Title = "Dead Rising 3 for Xbox One", Price = 69.99, ProductCategoryId = categoriesLookup["Xbox"].Id, ImagePrefix = "06", Description = "With an immersive open-world experience, intense action and unmatched level of weapon, a new generation of zombie-slaying fun has arrived with Dead Rising 3." },
            new { Title = "Wedge Touch Mouse Surface Edition", Price = 69.9, ProductCategoryId = categoriesLookup["Surface"].Id, ImagePrefix = "07", Description = "This special-edition Wedge Touch Mouse perfectly complements your Surface, Surface 2, Surface Pro, or Surface Pro 2." },
            new { Title = "Nokia Lumia 1320", Price = 560d, ProductCategoryId = categoriesLookup["Lumia"].Id, ImagePrefix = "08", Description = "With a 6\" display and bright, colourful design that really stands out from the crowd, the Nokia Lumia 1320 makes a statement in any situation." },
            new { Title = "Xbox One", Price = 499.99, ProductCategoryId = categoriesLookup["Xbox"].Id, ImagePrefix = "09", Description = "Introducing the all-in-one entertainment system. Xbox One is a state-of-the-art gaming console, a new generation TV and movie system, and a whole lot more."},
            new { Title = "Type Cover 2", Price = 129.99, ProductCategoryId = categoriesLookup["Surface"].Id, ImagePrefix = "10", Description = "The next-generation classic click-in keyboard for Surface now comes in four colors and is backlit to keep you working when the lights go down." },
            new { Title = "Office 365 Home Premium", Price = 99.0, ProductCategoryId = categoriesLookup["Office"].Id, ImagePrefix = "11", Description = "Get a subscription including Word, Excel, PowerPoint and SkyDrive cloud storage for 5 PCs or Macs, plus select mobile devices." },
            new { Title = "Surface 2", Price = 449d, ProductCategoryId = categoriesLookup["Surface"].Id, ImagePrefix = "12", Description = "Thin, light tablet with up to 10-hour battery life."},
            new { Title = "Windows 8.1 Pro", Price = 279.00 , ProductCategoryId = categoriesLookup["Windows"].Id, ImagePrefix = "13", Description = "The new Windows 8.1 lets you watch movies or play games, chat with friends, access files anywhere or find your next favourite app in the Windows Store."},
            new { Title = "Xbox One Wireless Controller", Price = 59.99, ProductCategoryId = categoriesLookup["Xbox" ].Id, ImagePrefix = "14", Description = "Experience the action like never before with the Xbox One Wireless Controller. With over 40 innovations, it's simply the best controller Xbox has ever made."}
        };

        context.Configuration.AutoDetectChangesEnabled = false;

        foreach (var productInfo in productsData)
        {
            var product = new Product
            {
                Available = true,
                CreationDate = DateTime.UtcNow,
                Description = productInfo.Description,
                ThumbnailPicture = GetPicture(string.Format(SmallPicturePath, productInfo.ImagePrefix)),
                LargePicture = GetPicture(string.Format(PicturePath, productInfo.ImagePrefix)),
                Price = productInfo.Price,
                ProductCategoryId = productInfo.ProductCategoryId,
                Title = productInfo.Title
            };

            context.Products.Add(product);
        }

        context.Configuration.AutoDetectChangesEnabled = true;

        context.SaveChanges();
    }

    private static void CreateBuyerData(MyExpenseDataContext context)
    {
        var silverCategory = new BuyerCategory() { Name = "Silver", MaxPointsInFiscalYear = 500 };
        var platinumCategory = new BuyerCategory() { Name = "Platinum", MaxPointsInFiscalYear = 1000 };

        context.BuyerCategories.AddRange(new BuyerCategory[]
        {
                silverCategory,
                platinumCategory
        });

        context.SaveChanges();

        context.Configuration.AutoDetectChangesEnabled = false;

        var employeesCount = Common.EmployeeEmails.Count;
        var products = context.Products.ToList();
        var random = new Random();
        for (var i = 0; i < MAX_EMPLOYEES_TO_PROCESS; i++)
        {
            var current = Common.EmployeeEmails[i];
            var buyer = new EmployeePurchase { BuyerCategoryId = 1, EmployeeId = i + 1, Points = 100 };


            var selectedProduct = products.ElementAt(random.Next(1, products.Count));

            buyer.PurchaseOrders = new List<PurchaseOrder>
            {
                new PurchaseOrder
                { EmployeeId = i+1,
                    PurchaseOrderItems= new List<PurchaseOrderItem> {
                new PurchaseOrderItem { ProductName = selectedProduct.Title,
                    PurchaseDate = DateTime.UtcNow,
                    Price = selectedProduct.Price,
                    ProductId = selectedProduct.Id,
                    ItemsNumber = random.Next(1,50)}
                } }
            };

            context.EmployeePurchases.Add(buyer);
        }

        context.Configuration.AutoDetectChangesEnabled = true;

        context.SaveChanges();
    }
}
