using System;
using System.Globalization;
using Xamarin.Forms;

namespace ContosoAir.Clients.Converters
{
    public class StringTimeConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if(value != null)
            {
                try
                {
                    DateTime datetime;

                    if (DateTime.TryParse(value.ToString(), out datetime))
                    {
                        return datetime.ToString("H:mm");
                    }
                }
                catch
                {
                    return string.Empty;
                }
            }

            return string.Empty;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
}
