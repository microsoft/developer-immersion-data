using System;
using System.Globalization;
using Xamarin.Forms;

namespace ContosoAir.Clients.Converters
{
    public class StringEmptyConverter : IValueConverter
    {
        private string Empty = "-";

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value == null)
                return Empty;

            var valueString = value.ToString();

            if(string.IsNullOrEmpty(valueString))
                return Empty;

            return value;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
}
