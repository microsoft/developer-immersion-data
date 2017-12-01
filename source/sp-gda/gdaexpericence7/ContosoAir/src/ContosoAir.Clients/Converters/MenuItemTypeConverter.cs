using ContosoAir.Clients.Models;
using System;
using System.Globalization;
using Xamarin.Forms;

namespace ContosoAir.Clients.Converters
{
    public class MenuItemTypeConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var menuItemType = (MenuItemType)value;

            switch (menuItemType)
            {
                case MenuItemType.Contact:
                    return (Device.OS == TargetPlatform.Windows ? "Assets/contact_icon.png" : "contact_icon");
                case MenuItemType.FindFlights:
                    return (Device.OS == TargetPlatform.Windows ? "Assets/flights_icon.png" : "flights_icon");
                case MenuItemType.MyTrips:
                    return (Device.OS == TargetPlatform.Windows ? "Assets/my_trips_icon.png" : "my_trips_icon");
                case MenuItemType.Profile:
                    return (Device.OS == TargetPlatform.Windows ? "Assets/profile_icon.png" : "profile_icon");
                default:
                    return string.Empty;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
}