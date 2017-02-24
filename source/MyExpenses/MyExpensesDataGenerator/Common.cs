using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyExpensesDataGenerator  
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;

    internal static class Common
    {
        private static readonly string Tenant =ConfigurationManager.AppSettings["Tenant"];

        public static List<Tuple<string, string, string, int>> _employeeData = new List<Tuple<string, string, string, int>>()
        {
            // Name, ID, Role, Team
            new Tuple<string, string, string,int>("Andrew Davis","100000K","SDE II",0),
            new Tuple<string, string, string, int>("Robin Count","105543X","Developer Lead",0),
            new Tuple<string, string, string, int>("Brooke Simon","105555X","Developer Lead",0),
            new Tuple<string, string, string, int>("Javion Hicks","109989I","SDET I",0),
            new Tuple<string, string, string, int>("Saanvi Blevins","136801C","SDET I",0),
                        new Tuple<string, string, string, int>("Dana Lindsay","131253W","HR I",1),
            new Tuple<string, string, string, int>("Danny Christensen","155714D","HR I",1),
            new Tuple<string, string, string, int>("Elliot Lott","108314I","HR II",1),
            new Tuple<string, string, string, int>("Aliana Hooper","186528T","HR Lead",1),
            new Tuple<string, string, string, int>("Muhammad Everett","193942F","Developer Lead",0),
            new Tuple<string, string, string, int>("Sage Perkins","142287L","SDET II",0),
            new Tuple<string, string, string, int>("Jaycob Schultz","155459G","SDE I",0),
            new Tuple<string, string, string, int>("Gunner Spencer","114735E","SDE I",0),
            new Tuple<string, string, string, int>("Eleanor Tate","117366L","SDE II",0),
            new Tuple<string, string, string, int>("Christian Ashley","104551K","SDE II",0),
            new Tuple<string, string, string, int>("Gavyn Snyder","130371Z","SDET II",0),
            new Tuple<string, string, string, int>("Leilani Townsend","137633W","SDE II",0),
            new Tuple<string, string, string, int>("Aiyana Gilliam","112486M","Developer Lead",0),
            new Tuple<string, string, string, int>("Rex Sherman","134578L","SDET II",0),
            new Tuple<string, string, string, int>("Tristan Middleton","198267I","SDET II",0),
            new Tuple<string, string, string, int>("Kirsten Hyde","114330H","SDET I",0),
            new Tuple<string, string, string, int>("Lucian Hebert","109472O","Developer Lead",0),
            new Tuple<string, string, string, int>("Viviana Rodriquez","111328C","SDET I",0),
            new Tuple<string, string, string, int>("Joyce Howard","139827O","SDET I",0),
            new Tuple<string, string, string, int>("Beau Barry","149563T","SDE I",0),
            new Tuple<string, string, string, int>("Avah Wolfe","150067J","SDET I",0),
            new Tuple<string, string, string, int>("Bristol Mullins","192483M","SDET I",0),
            new Tuple<string, string, string, int>("Adalynn Riley","140678D","SDE I",0),
            new Tuple<string, string, string, int>("Tyson Daniels","180489P","SDE I",0),
            new Tuple<string, string, string, int>("Jaden Bell","114911R","SDET I",0),
            new Tuple<string, string, string, int>("Jalen Vazquez","181115K","SDE II",0),
            new Tuple<string, string, string, int>("Maxim Fry","131750B","SDET I",0),
            new Tuple<string, string, string, int>("Paula Patton","191965R","SDET II",0),
            new Tuple<string, string, string, int>("Princess Farmer","146685G","SDET II",0),
            new Tuple<string, string, string, int>("Chana Cleveland","123354W","Developer Lead",0),
            new Tuple<string, string, string, int>("Jaylah Salinas","166183D","SDET II",0),
            new Tuple<string, string, string, int>("Eli King","102305A","SDET II",0),
            new Tuple<string, string, string, int>("Keyla Marshall","191229T","SDET I",0),
            new Tuple<string, string, string, int>("Emmalyn Clarke","110237U","SDE I",0),
            new Tuple<string, string, string, int>("Jensen Ratliff","174910Z","SDE I",0),
            new Tuple<string, string, string, int>("Diya Cabrera","114233U","SDE I",0),
            new Tuple<string, string, string, int>("Valentin Scott","153739D","SDET II",0),
            new Tuple<string, string, string, int>("Emiliano Shepard","179937F","SDE I",0),
            new Tuple<string, string, string, int>("Kirsten Hurley","135091O","SDET II",0),
            new Tuple<string, string, string, int>("Kailee Woodard","166592D","Developer Lead",0),
            new Tuple<string, string, string, int>("Travis Callahan","147906Y","SDET I",0),
            new Tuple<string, string, string, int>("Jaylyn Ortiz","187966I","SDE I",0),
            new Tuple<string, string, string, int>("Kaylynn Jimenez","124846X","SDET II",0),
            new Tuple<string, string, string, int>("Hezekiah Ratliff","156112P","Developer Lead",0),
            new Tuple<string, string, string, int>("Jorge Atkinson","196675B","SDE I",0),
            new Tuple<string, string, string, int>("Natasha Stanley","142166Y","SDET I",0),
            new Tuple<string, string, string, int>("Messiah Wright","154626A","SDET II",0),
            new Tuple<string, string, string, int>("Nina Reid","177218O","SDET II",0),
            new Tuple<string, string, string, int>("Dalia Calhoun","152249B","SDET II",0),
            new Tuple<string, string, string, int>("Jair Tran","197556F","SDE II",0),
            new Tuple<string, string, string, int>("Marlee Pearson","186052V","Developer Lead",0),
            new Tuple<string, string, string, int>("Francisco Cole","130737W","SDET II",0),
            new Tuple<string, string, string, int>("Kali Howell","125365I","SDET I",0),
            new Tuple<string, string, string, int>("London Shields","148654U","Developer Lead",0),
            new Tuple<string, string, string, int>("Mario Brennan","114301X","SDE II",0),
            new Tuple<string, string, string, int>("Hayden Wright","184452I","SDE I",0),
            new Tuple<string, string, string, int>("Janiya Alston","108279O","SDE I",0),
            new Tuple<string, string, string, int>("Emilie Witt","113294A","SDE II",0),
            new Tuple<string, string, string, int>("Macie Lang","146029K","SDET II",0),
            new Tuple<string, string, string, int>("Scott Contreras","128481P","SDE I",0),
            new Tuple<string, string, string, int>("Teagan Peters","169551Q","SDE I",0),
            new Tuple<string, string, string, int>("Beckett Robles","185611E","SDET I",0),
            new Tuple<string, string, string, int>("Jackson Cole","162334P","SDE II",0),
            new Tuple<string, string, string, int>("Tabitha Farley","112015T","SDE I",0),
            new Tuple<string, string, string, int>("Whitney Caldwell","135361C","SDE I",0),
            new Tuple<string, string, string, int>("Jax Fox","189193V","SDET II",0),
            new Tuple<string, string, string, int>("Analia Williams","177896I","SDET I",0),
            new Tuple<string, string, string, int>("Sharon Spence","161999H","SDE II",0),
            new Tuple<string, string, string, int>("Yamilet Delgado","180576Z","SDET I",0),
            new Tuple<string, string, string, int>("Damaris Cummings","118867M","SDET II",0),
            new Tuple<string, string, string, int>("Cain Davenport","121358V","Developer Lead",0),
            new Tuple<string, string, string, int>("Trystan Sellers","169324H","Developer Lead",0),
            new Tuple<string, string, string, int>("Kayson Morton","112044E","SDE I",0),
            new Tuple<string, string, string, int>("Ava Hoover","123451J","SDET II",0),
            new Tuple<string, string, string, int>("Jaeden Delgado","118622Y","SDET II",0),
            new Tuple<string, string, string, int>("Lexi Dunlap","118869F","SDE II",0),
            new Tuple<string, string, string, int>("Ian Olson","181055O","SDET I",0),
            new Tuple<string, string, string, int>("Iris Mason","183543M","SDE II",0),
            new Tuple<string, string, string, int>("Samantha Douglas","191881C","Developer Lead",0),
            new Tuple<string, string, string, int>("Owen Sosa","101954D","Developer Lead",0),
            new Tuple<string, string, string, int>("Armani Johnston","110823H","Developer Lead",0),
            new Tuple<string, string, string, int>("Nova Sherman","126916S","SDET I",0),
            new Tuple<string, string, string, int>("Ariel Fowler","199266S","Developer Lead",0),
            new Tuple<string, string, string, int>("Giada Hansen","121357I","SDE I",0),
            new Tuple<string, string, string, int>("Crystal Hickman","105455O","SDE II",0),
            new Tuple<string, string, string, int>("Shiloh Frazier","140056T","SDE II",0),
            new Tuple<string, string, string, int>("Amiyah Smith","187962Y","SDET I",0),
            new Tuple<string, string, string, int>("Nathanael Olson","111103T","SDE I",0),
            new Tuple<string, string, string, int>("Hanna Britt","127461V","Developer Lead",0),
            new Tuple<string, string, string, int>("Myla Cross","134669B","SDE I",0),
            new Tuple<string, string, string, int>("Damion Greer","182441Z","SDET I",0),
            new Tuple<string, string, string, int>("Aidan Compton","120365Q","SDET II",0),
            new Tuple<string, string, string, int>("Kristian Young","104561A","SDE I",0),
            new Tuple<string, string, string, int>("Hezekiah Green","110126F","SDET I",0),
            new Tuple<string, string, string, int>("Marquis Macias","168207X","SDET II",0),
            new Tuple<string, string, string, int>("Lilyanna Lopez","135730D","SDET I",0),
            new Tuple<string, string, string, int>("Ignacio Campos","157133Q","SDE II",0),
            new Tuple<string, string, string, int>("Emmy Barber","108974W","SDE II",0),
            new Tuple<string, string, string, int>("Erika Logan","163417A","SDET II",0),
            new Tuple<string, string, string, int>("Taylor Moss","117936G","Developer Lead",0),
            new Tuple<string, string, string, int>("Hayley Melton","192327M","SDET I",0),
            new Tuple<string, string, string, int>("Maurice Alston","163181V","HR II",1),
            new Tuple<string, string, string, int>("Campbell Callahan","130280V","HR Lead",1),
            new Tuple<string, string, string, int>("Zachary Kramer","159704U","HR II",1),
            new Tuple<string, string, string, int>("Izayah Michael","106955D","HR II",1),
            new Tuple<string, string, string, int>("Jessie Anthony","195186O","HR I",1),
            new Tuple<string, string, string, int>("Ana Gaines","194725J","HR II",1)
        };
        public static List<Tuple<string, string>> EmployeeEmails = CreateEmployeesMails();

        private static List<Tuple<string, string>> CreateEmployeesMails()
        {
            var mails = new List<Tuple<string, string>>();
            foreach (var employee in _employeeData)
            {
                var employeeName = employee.Item1;
                var email = string.Concat(employeeName.Replace(' ', '.'), $"@{Tenant}");
                mails.Add(new Tuple<string, string>(employeeName, email));
            }

            return mails;
        }

    }
}