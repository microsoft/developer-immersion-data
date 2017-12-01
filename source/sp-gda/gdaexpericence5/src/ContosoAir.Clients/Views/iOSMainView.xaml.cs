using System;
using System.Linq;
using Xamarin.Forms;

namespace ContosoAir.Clients.Views
{
    public partial class iOSMainView : TabbedPage
    {
        public Page PreviousPage { get; set; }

        public iOSMainView()
        {
            NavigationPage.SetHasNavigationBar(this, false);
            InitializeComponent();
        }

        public void AddPage(Page page, string title)
        {
            var navigationPage = new CustomNavigationPage(page)
            {
                Title = title,
                Icon = GetIconForPage(page)
            };

            if (PreviousPage == null)
            {
                PreviousPage = page;
            }

            Children.Add(navigationPage);
        }

        public bool TrySetCurrentPage(Page requiredPage)
        {
            return TrySetCurrentPage(requiredPage.GetType());
        }

        public bool TrySetCurrentPage(Type requiredPageType)
        {
            CustomNavigationPage page = GetTabPageWithInitial(requiredPageType);

            if (page != null)
            {
                CurrentPage = null;
                CurrentPage = page;
            }

            return page != null;
        }

        private CustomNavigationPage GetTabPageWithInitial(Type type)
        {
            CustomNavigationPage page = Children.OfType<CustomNavigationPage>()                           
                .FirstOrDefault(p =>
                {
                    return p.CurrentPage.Navigation.NavigationStack.Count > 0
                        ? p.CurrentPage.Navigation.NavigationStack[0].GetType() == type
                        : false;
                });

            return page;
        }

        private string GetIconForPage(Page page)
        {
            string icon = string.Empty;

            if (page is BotView)
            {
                icon = "menu_contact";
            }
            else if (page is FindFlightsView)
            {
                icon = "menu_find";
            }
            else if (page is MyTripsView)
            {
                icon = "menu_trips";
            }
            else if (page is ProfileView)
            {
                icon = "menu_profile";
            }

			page.AutomationId = icon;

            return icon;
        }
    }
}