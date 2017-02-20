using Microsoft.Analytics.Interfaces;
using Microsoft.Analytics.Types.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace DataLakeCustomerAnalysis
{
    public class Udfs{
        public static bool IsProductDetailsPageOrPurchase(string query)
        {
            return Regex.IsMatch(query, @"\/api\/Products\/\d+")
                || Regex.IsMatch(query, @"\/api\/Orders\/AddToCart\/\d+");
        }

        public static string GetProductId(string url)
        {
            return url.Split('/').Last();
        }
        public static DateTime GetFullDate(DateTime? date, DateTime? time)
        {
            return date.Value.AddHours(time.Value.Hour).AddMinutes(time.Value.Minute).AddSeconds(time.Value.Second);
        }
        public static double DateDiff(DateTime? visitTime, DateTime? purchaseTime)
        {
            return purchaseTime.Value.Subtract(visitTime.Value).TotalMinutes;
        }
    }
}
