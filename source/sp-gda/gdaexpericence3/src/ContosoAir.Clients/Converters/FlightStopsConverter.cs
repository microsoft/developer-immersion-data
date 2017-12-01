using System;
using System.Globalization;
using Xamarin.Forms;

namespace ContosoAir.Clients.Converters
{
    public class FlightStopsConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            int? numberOfStops = value as int?;

            return numberOfStops.HasValue
                ? GetNumberOfStopsString(numberOfStops.Value)
                : string.Empty;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }

        private static string GetNumberOfStopsString(int numberOfStops)
        {
            return numberOfStops == 1
                ? $"{numberOfStops} stop"
                : $"{numberOfStops} stops";
        }
    }
}
