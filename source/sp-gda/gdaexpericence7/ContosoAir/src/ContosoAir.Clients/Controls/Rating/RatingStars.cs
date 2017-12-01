using FFImageLoading.Forms;
using System.Collections.Generic;
using Xamarin.Forms;

namespace ContosoAir.Clients.Controls
{
    public class RatingStars : ContentView
    {
        private List<CachedImage> StarImages { get; set; }

        public Slider Slider { get; set; }

        public static readonly BindableProperty RatingProperty =
          BindableProperty.Create(propertyName: nameof(Rating),
              returnType: typeof(int),
              declaringType: typeof(RatingStars),
              defaultValue: 0,
              defaultBindingMode: BindingMode.TwoWay,
              propertyChanged: UpdateStarsDisplay);

        public int Rating
        {
            get { return (int)GetValue(RatingProperty); }
            set { SetValue(RatingProperty, value); }
        }

        public static readonly BindableProperty PrecisionProperty =
          BindableProperty.Create(propertyName: nameof(Precision),
              returnType: typeof(PrecisionType),
              declaringType: typeof(RatingStars),
              defaultValue: PrecisionType.Half,
              propertyChanged: OnPrecisionPropertyChanged);

        public PrecisionType Precision
        {
            get { return (PrecisionType)GetValue(PrecisionProperty); }
            set { SetValue(PrecisionProperty, value); }
        }

        public static readonly BindableProperty ImageFullStarProperty =
          BindableProperty.Create(propertyName: nameof(ImageFullStar),
              returnType: typeof(ImageSource),
              declaringType: typeof(RatingStars),
              defaultValue: ImageSource.FromResource("ContosoAir.Clients.Controls.Rating.rating_full.png"),
              propertyChanged: UpdateStarsDisplay);

        public ImageSource ImageFullStar
        {
            get { return (ImageSource)GetValue(ImageFullStarProperty); }
            set { SetValue(ImageFullStarProperty, value); }
        }

        public static readonly BindableProperty ImageEmptyStarProperty =
          BindableProperty.Create(propertyName: nameof(ImageEmptyStar),
              returnType: typeof(ImageSource),
              declaringType: typeof(RatingStars),
              defaultValue: ImageSource.FromResource("ContosoAir.Clients.Controls.Rating.rating_empty.png"),
              propertyChanged: UpdateStarsDisplay);

        public ImageSource ImageEmptyStar
        {
            get { return (ImageSource)GetValue(ImageEmptyStarProperty); }
            set { SetValue(ImageEmptyStarProperty, value); }
        }

        public static readonly BindableProperty ImageHalfStarProperty =
          BindableProperty.Create(propertyName: nameof(ImageHalfStar),
              returnType: typeof(ImageSource),
              declaringType: typeof(RatingStars),
              defaultValue: ImageSource.FromResource("ContosoAir.Clients.Controls.Rating.rating_half.png"),
              propertyChanged: UpdateStarsDisplay);

        public ImageSource ImageHalfStar
        {
            get { return (ImageSource)GetValue(ImageHalfStarProperty); }
            set { SetValue(ImageHalfStarProperty, value); }
        }

        public RatingStars() : base()
        {
            Grid grid = new Grid();
            grid.ColumnSpacing = 28;

            //Create Star Image Placeholders 
            StarImages = new List<CachedImage>();
            for (int i = 0; i < 5; i++)
            {
                StarImages.Add(new CachedImage()
                {
                    HorizontalOptions = LayoutOptions.Start
                });

                // add image
                grid.Children.Add(StarImages[i], i + 1, 0);
            }

            // add slider for pan gesture
            Slider = new TransparentSlider();
            Slider.Maximum = Precision.Equals(PrecisionType.Half) ? 10 : 5;
            Slider.Opacity = Device.OnPlatform(1, 0, 0);
            Slider.ValueChanged += OnRatingValueChanged;
            Grid.SetColumnSpan(Slider, 6);
            grid.Children.Add(Slider);

            this.Content = grid;
        }

        private void OnRatingValueChanged(object sender, ValueChangedEventArgs e)
        {
            Rating = (int)e.NewValue;
        }

        private static void UpdateStarsDisplay(BindableObject bindable, object oldValue, object newValue)
        {
            ((RatingStars)bindable).UpdateStarsDisplay();
        }

        private static void OnPrecisionPropertyChanged(BindableObject bindable, object oldValue, object newValue)
        {
            var control = ((RatingStars)bindable);
            control.Slider.Maximum = ((PrecisionType)newValue).Equals(PrecisionType.Half) ? 10 : 5;
            control.UpdateStarsDisplay();
        }

        // Fill the star based on the Rating value
        private void UpdateStarsDisplay()
        {
            for (int i = 0; i < StarImages.Count; i++)
            {
                StarImages[i].Source = GetStarSource(i);
            }
        }

        private ImageSource GetStarSource(int position)
        {
            int currentStarMaxRating = (position + 1);

            if (Precision.Equals(PrecisionType.Half))
            {
                currentStarMaxRating *= 2;
            }

            if (Rating >= currentStarMaxRating)
            {
                return ImageFullStar;
            }
            else if (Rating >= currentStarMaxRating - 1 && Precision.Equals(PrecisionType.Half))
            {
                return ImageHalfStar;
            }
            else
            {
                return ImageEmptyStar;
            }
        }

        public enum PrecisionType
        {
            Full,
            Half
        }
    }
}