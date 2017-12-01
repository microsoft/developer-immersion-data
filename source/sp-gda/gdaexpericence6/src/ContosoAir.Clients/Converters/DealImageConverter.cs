using System;
using System.Globalization;
using Xamarin.Forms;

namespace ContosoAir.Clients.Converters
{
    public class DealImageConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value == null)
            {
                return value;
            }

            var platform = Device.OS == TargetPlatform.Windows;

            var cityName = value.ToString().Replace(' ', '_').ToLower();

            return platform ? 
                string.Format("Assets/{0}.png", cityName) : 
                string.Format("{0}.png", cityName);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
}
