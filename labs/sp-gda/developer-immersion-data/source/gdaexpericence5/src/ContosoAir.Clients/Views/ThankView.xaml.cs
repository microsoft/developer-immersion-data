using ContosoAir.Clients.ViewModels;
using Xamarin.Forms;

namespace ContosoAir.Clients.Views
{
    public partial class ThankView : ContentPage
    {
        public string feedbackDataResponse;
        public string _feedbackOutput;
        public string dummyVar;

        public ThankView()
        {
            InitializeComponent();

            //Dynamically add messages depanding on the end your feedback description score
            var demoFlight = ContosoAir.Clients.ViewModels.FeedbackViewModel.demoFeedback;

            var goodReviewText = "Thank you for providing feedback";
            var badReviewText = "We're sorry for the inconvenience and would like to offer you a free drink coupon for your next trip.";

            if (demoFlight == "good")
            {
                //Add message for good review
                ThanksTextLabels.Text = goodReviewText;
            }
            else
            {
                //Add message for bad review
                ThanksTextLabels.Text = badReviewText;
            }

        }

    }
}

