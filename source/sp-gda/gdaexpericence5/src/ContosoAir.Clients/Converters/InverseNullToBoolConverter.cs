using System;
using System.Globalization;
using Xamarin.Forms;

namespace ContosoAir.Clients.Converters
{
	public class InverseNullToBoolConverter : IValueConverter
	{
		public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
		{
			if (value == null)
				return true;

			return false;
		}

		public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
		{
			return null;
		}
	}
}