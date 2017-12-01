using ContosoAir.Clients.DataServices.Authentication;
using ContosoAir.Clients.DataServices.Base;
using ContosoAir.Clients.DataServices.Checkin;
using ContosoAir.Clients.DataServices.Deals;
using ContosoAir.Clients.DataServices.Trips;
using ContosoAir.Clients.Services.Authentication;
using ContosoAir.Clients.Services.BingSpeech;
using ContosoAir.Clients.Services.Camera;
using ContosoAir.Clients.Services.Dialog;
using ContosoAir.Clients.Services.Emotion;
using ContosoAir.Clients.Services.Msal;
using ContosoAir.Clients.Services.Navigation;
using ContosoAir.Clients.Services.Notifications;
using Microsoft.Practices.Unity;
using System;

namespace ContosoAir.Clients.ViewModels.Base
{
    public class ViewModelLocator
    {
        private readonly IUnityContainer _unityContainer;

        private static readonly ViewModelLocator _instance = new ViewModelLocator();

        public static ViewModelLocator Instance
        {
            get
            {
                return _instance;
            }
        }

        protected ViewModelLocator()
        {
            _unityContainer = new UnityContainer();

            // Providers
            _unityContainer.RegisterType<IRequestProvider, RequestProvider>();
            _unityContainer.RegisterType<IPlatformParameterProvider, DefaultPlatformParameterProvider>();

            // Services
            _unityContainer.RegisterType<IDialogService, DialogService>();
            _unityContainer.RegisterType<IBrowserCookiesService, DefaultBrowserCookiesService>();
            RegisterSingleton<INavigationService, NavigationService>();
            _unityContainer.RegisterType<IPushNotificationService, PushNotificationService>();
            _unityContainer.RegisterType<ICameraService, CameraService>();
            _unityContainer.RegisterType<ICognitiveAuthenticationService, CognitiveAuthenticationService>();
            _unityContainer.RegisterType<IEmotionService, EmotionService>();
            _unityContainer.RegisterType<IBingSpeechService, BingSpeechService>();

            // Data services
            _unityContainer.RegisterType<IAuthenticationService, AuthenticationService>();
            _unityContainer.RegisterType<ICheckinService, FakeCheckinService>();
            _unityContainer.RegisterType<IDealsService, DealsService>();
            _unityContainer.RegisterType<ITripsService, FakeTripsService>();

            // View models
            _unityContainer.RegisterType<BotViewModel>();
            _unityContainer.RegisterType<CheckInViewModel>();
            _unityContainer.RegisterType<ConfirmationViewModel>();
            _unityContainer.RegisterType<FeedbackViewModel>();
            _unityContainer.RegisterType<FindFlightsViewModel>();
            _unityContainer.RegisterType<LoginViewModel>();
            _unityContainer.RegisterType<MainViewModel>();
            _unityContainer.RegisterType<MenuViewModel>();
            _unityContainer.RegisterType<MyTripsViewModel>();
            _unityContainer.RegisterType<ProfileViewModel>();
            _unityContainer.RegisterType<SettingsViewModel>();
            _unityContainer.RegisterType<SignUpViewModel>();
            _unityContainer.RegisterType<ThankViewModel>();
            _unityContainer.RegisterType<CurrentDealStatusViewModel>();
        }

        public T Resolve<T>()
        {
            return _unityContainer.Resolve<T>();
        }

        public object Resolve(Type type)
        {
            return _unityContainer.Resolve(type);
        }

        public void Register<T>(T instance)
        {
            _unityContainer.RegisterInstance<T>(instance);
        }

        public void Register<TInterface, T>() where T : TInterface
        {
            _unityContainer.RegisterType<TInterface, T>();
        }

        public void RegisterSingleton<TInterface, T>() where T : TInterface
        {
            _unityContainer.RegisterType<TInterface, T>(new ContainerControlledLifetimeManager());
        }
    }
}