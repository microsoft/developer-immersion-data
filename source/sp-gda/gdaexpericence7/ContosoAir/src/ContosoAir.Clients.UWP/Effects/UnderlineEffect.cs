using ContosoAir.Clients.UWP.Effects;
using System;
using System.Diagnostics;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Documents;
using Xamarin.Forms;
using Xamarin.Forms.Platform.UWP;

[assembly: ExportEffect(typeof(UnderlineEffect), "UnderlineEffect")]
namespace ContosoAir.Clients.UWP.Effects
{
    public class UnderlineEffect : PlatformEffect
    {
        protected override void OnAttached()
        {
            SetUnderline(true);
        }

        protected override void OnDetached()
        {
            SetUnderline(false);
        }

        protected override void OnElementPropertyChanged(System.ComponentModel.PropertyChangedEventArgs args)
        {
            base.OnElementPropertyChanged(args);

            if (args.PropertyName == Label.TextProperty.PropertyName || args.PropertyName == Label.FormattedTextProperty.PropertyName)
            {
                SetUnderline(true);
            }
        }

        private void SetUnderline(bool underlined)
        {
            try
            {
                var textBlock = (TextBlock)Control;
                if (underlined)
                {
                    var text = textBlock.Text;
                    Underline underline = new Underline();
                    Run run = new Run();
                    run.Text = text;
                    textBlock.Text = string.Empty;
                    underline.Inlines.Add(run);
                    textBlock.Inlines.Add(underline);
                }
                else
                {
                    textBlock.Inlines.Clear();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Cannot underline Label. Error: ", ex.Message);
            }
        }
    }
}
