using Microsoft.Analytics.Interfaces;
using Microsoft.Analytics.Types.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace DataLakeCustomerAnalysis
{
    public class Udfs
    {
        public static bool IsProductDetailsPageOrPurchase(string query)
        {
            return Regex.IsMatch(query, @"\/api\/Products\/\d+",RegexOptions.IgnoreCase) 
                || Regex.IsMatch(query, @"\/api\/Orders\/AddToCart\/\d+", RegexOptions.IgnoreCase);
        }

        public static string GetProductId(string url)
        {
            return url.Split('/').Last();
        }

        public static double GetConversionRate(double? visits, double? purchases)
        {
            if (!visits.HasValue || !purchases.HasValue)
                return 0;
            return Math.Round(((purchases.Value / visits.Value) * 100), 2); 
        }


    }    
}
