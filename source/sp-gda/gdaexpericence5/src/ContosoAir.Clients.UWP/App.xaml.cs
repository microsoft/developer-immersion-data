using ContosoAir.Clients.Models;
using ContosoAir.Clients.Services.Notifications;
using ContosoAir.Clients.UWP.Services.Notifications;
using ContosoAir.Clients.ViewModels.Base;
using FFImageLoading.Forms;
using FFImageLoading.Forms.WinUWP;
using Microsoft.HockeyApp;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.Foundation.Metadata;
using Windows.UI;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;




namespace ContosoAir.Clients.UWP
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    sealed partial class App : Application
    {
        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App()
        {

            this.InitializeComponent();
            this.Suspending += OnSuspending;
            ViewModelLocator.Instance.RegisterSingleton<INativePushNotificationService, NativePushNotificationService>();
        }

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used such as when the application is launched to open a specific file.
        /// </summary>
        /// <param name="e">Details about the launch request and process.</param>
        protected override async void OnLaunched(LaunchActivatedEventArgs e)
        {
            await InitNotificationsAsync();

#if DEBUG
            if (System.Diagnostics.Debugger.IsAttached)
            {
                this.DebugSettings.EnableFrameRateCounter = true;
            }
#endif
            UiCustomizations();

            Frame rootFrame = Window.Current.Content as Frame;

            // Do not repeat app initialization when the Window already has content,
            // just ensure that the window is active
            if (rootFrame == null)
            {
                // Create a Frame to act as the navigation context and navigate to the first page
                rootFrame = new Frame();

                rootFrame.NavigationFailed += OnNavigationFailed;

                var assembliesToInclude = new List<Assembly>()
                {
                    typeof(CachedImage).GetTypeInfo().Assembly,
                    typeof(CachedImageRenderer).GetTypeInfo().Assembly
                };

                Xamarin.Forms.Forms.Init(e, assembliesToInclude);

                if (GlobalSettings.HockeyAppUWP != nameof(GlobalSettings.HockeyAppUWP))
                {
                    HockeyClient.Current.Configure(GlobalSettings.HockeyAppUWP);
                }

                if (e.PreviousExecutionState == ApplicationExecutionState.Terminated)
                {
                    //TODO: Load state from previously suspended application
                }

                // Place the frame in the current Window
                Window.Current.Content = rootFrame;
            }

            if (rootFrame.Content == null)
            {
                // When the navigation stack isn't restored navigate to the first page,
                // configuring the new page by passing required information as a navigation
                // parameter
                rootFrame.Navigate(typeof(MainPage), e.Arguments);
            }
            // Ensure the current window is active
            Window.Current.Activate();
        }

        private async Task InitNotificationsAsync()
        {
            var service = ViewModelLocator.Instance.Resolve<INativePushNotificationService>() as NativePushNotificationService;
            await service?.InitNotificationsAsync();
        }

        protected override void OnActivated(IActivatedEventArgs args)
        {
            base.OnActivated(args);

            if (args.Kind ==  ActivationKind.ToastNotification)
            {
                var toastActivationArgs = args as ToastNotificationActivatedEventArgs;
                var pushNotificationService = ViewModelLocator.Instance.Resolve<IPushNotificationService>();

                NotificationType type = pushNotificationService.GetNotificationTypeFromData(toastActivationArgs.Argument);
                pushNotificationService?.HandleNotificationActivationAsync(type);
            }
        }

        /// <summary>
        /// Invoked when Navigation to a certain page fails
        /// </summary>
        /// <param name="sender">The Frame which failed navigation</param>
        /// <param name="e">Details about the navigation failure</param>
        void OnNavigationFailed(object sender, NavigationFailedEventArgs e)
        {
            throw new Exception("Failed to load Page " + e.SourcePageType.FullName);
        }

        /// <summary>
        /// Invoked when application execution is being suspended.  Application state is saved
        /// without knowing whether the application will be terminated or resumed with the contents
        /// of memory still intact.
        /// </summary>
        /// <param name="sender">The source of the suspend request.</param>
        /// <param name="e">Details about the suspend request.</param>
        private void OnSuspending(object sender, SuspendingEventArgs e)
        {
            var deferral = e.SuspendingOperation.GetDeferral();
            //TODO: Save application state and stop any background activity
            deferral.Complete();
        }

        private static void UiCustomizations()
        {
            if (ApiInformation.IsTypePresent("Windows.UI.ViewManagement.StatusBar"))
            {
                var statusBar = StatusBar.GetForCurrentView();
                if (statusBar != null)
                {
                    statusBar.BackgroundOpacity = 1;
                    statusBar.BackgroundColor = Color.FromArgb(0xFF, 0x6B, 0xA0, 0xCE);
                    statusBar.ForegroundColor = Colors.White;
                }
            }
        }
    }
}
/*
namespace documentDbIntegration.WinPhone
{
    public class DocumentDbIntegrations : IDocimentDbServices
    {
        public DocumentDbIntegrations() { }
        public const string EndpointUri="";
        public const string PrimaryKey = "";
        public async void Speak(string text)
        {
            DocumentClient.client = new DocumentClient(new Uri(EndpointUri), PrimaryKey);
        }
    }
}*/