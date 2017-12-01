// Helpers/Settings.cs
using Plugin.Settings;
using Plugin.Settings.Abstractions;

namespace ContosoAir.Clients.Helpers
{
    /// <summary>
    /// This is the Settings static class that can be used in your Core solution or in any
    /// of your client applications. All settings are laid out the same exact way with getters
    /// and setters. 
    /// </summary>
    public static class Settings
    {
        private static ISettings AppSettings
        {
            get
            {
                return CrossSettings.Current;
            }
        }

        #region Setting Constants

        private const string AuthKey = "auth_key";
        private static readonly bool AuthDefault = false;

        private const string SigninProviderKey = "provider_key";
        private static readonly string DefaultSigninProvider = string.Empty;

        private const string UserNameKey = "username_key";
        private static readonly string DefaultUserName = string.Empty;

        private const string UserIdKey = "userid_key";
        private static readonly string DefaultUserId = string.Empty;

        private const string DelayedTimeKey = "delayedtime_key";
        private static readonly int DefaultDelayedTime = GlobalSettings.DefaultDelayedTime;

        private const string FeedbackTimeKey = "feedbacktime_key";
        private static readonly int DefaultFeedbackTime = GlobalSettings.DefaultFeedbackTime;

        private const string ContosoAirEndpointKey = "contosoairendpoint_key";
        private const string DefaultContosoAirEndpoint = GlobalSettings.ContosoAirEndpoint;

        private const string ClientIdKey = "clientid_key";
        private const string DefaultClientId = GlobalSettings.ClientId;

        private const string SignUpSignInPolicyKey = "signupsigninpolicy_key";
        private const string DefaultSignUpSignInPolicy = GlobalSettings.SignUpSignInPolicy;

        private const string TenantKey = "tenant_key";
        private const string DefaultTenant = GlobalSettings.Tenant;

        private const string SkypeBotAccountKey = "skypebotaccountid_key";
        private const string DefaultSkypeBotAccount = GlobalSettings.SkypeBotAccount;


        private const string CognitiveServicesKeyKey = "9d9c35e88d474674a8e8b6f04de75a96";
        private const string DefaultCognitiveServicesKey = GlobalSettings.CognitiveServicesKey;

        private const string BingSpeechApiKeyKey = "d7d3aa6cb8b94e31a2ac7b0cb37834ff";//"bingspeechapi_key";
        private const string DefaultBingSpeechApiKey = GlobalSettings.BingSpeechApiKey;

        private const string NotificationHubConnectionStringKey = "notificationhubconnectionstring_key";
        private const string DefaultNotificationHubConnectionString = GlobalSettings.NotificationHubConnectionString;

        private const string NotificationHubNameKey = "notificationhubname_key";
        private const string DefaultNotificationHubName = GlobalSettings.NotificationHubName;

        private const string AndroidProjectNumberKey = "androidprojectnumber_key";
        private const string DefaultAndroidProjectNumber = GlobalSettings.AndroidProjectNumber;
        #endregion

        public static bool AuthSettings
        {
            get
            {
                return AppSettings.GetValueOrDefault<bool>(AuthKey, AuthDefault);
            }
            set
            {
                AppSettings.AddOrUpdateValue<bool>(AuthKey, value);
            }
        }

        public static string SigninProvider
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(SigninProviderKey, DefaultSigninProvider);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(SigninProviderKey, value);
            }
        }

        public static string UserName
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(UserNameKey, DefaultUserName);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(UserNameKey, value);
            }
        }

        public static string UserId
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(UserIdKey, DefaultUserId);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(UserIdKey, value);
            }
        }

        public static int DelayedTime
        {
            get
            {
                return AppSettings.GetValueOrDefault<int>(DelayedTimeKey, DefaultDelayedTime);
            }
            set
            {
                AppSettings.AddOrUpdateValue<int>(DelayedTimeKey, value);
            }
        }

        public static int FeedbackTime
        {
            get
            {
                return AppSettings.GetValueOrDefault<int>(FeedbackTimeKey, DefaultFeedbackTime);
            }
            set
            {
                AppSettings.AddOrUpdateValue<int>(FeedbackTimeKey, value);
            }
        }

        public static string ClientId
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(ClientIdKey, DefaultClientId);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(ClientIdKey, value);
            }
        }

        public static string SignUpSignInPolicy
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(SignUpSignInPolicyKey, DefaultSignUpSignInPolicy);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(SignUpSignInPolicyKey, value);
            }
        }

        public static string ContosoAirEndpoint
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(ContosoAirEndpointKey, DefaultContosoAirEndpoint);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(ContosoAirEndpointKey, value);
            }
        }

        public static string Tenant
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(TenantKey, DefaultTenant);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(TenantKey, value);
            }
        }
        
        public static string SkypeBotAccount
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(SkypeBotAccountKey, DefaultSkypeBotAccount);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(SkypeBotAccountKey, value);
            }
        }
        

        public static string CognitiveServicesKey
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(CognitiveServicesKeyKey, DefaultCognitiveServicesKey);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(CognitiveServicesKeyKey, value);
            }
        }

        public static string BingSpeechApiKey
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(BingSpeechApiKeyKey, DefaultBingSpeechApiKey);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(BingSpeechApiKeyKey, value);
            }
        }

        public static string NotificationHubConnectionString
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(NotificationHubConnectionStringKey, DefaultNotificationHubConnectionString);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(NotificationHubConnectionStringKey, value);
            }
        }

        public static string NotificationHubName
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(NotificationHubNameKey, DefaultNotificationHubName);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(NotificationHubNameKey, value);
            }
        }

        public static string AndroidProjectNumber
        {
            get
            {
                return AppSettings.GetValueOrDefault<string>(AndroidProjectNumberKey, DefaultAndroidProjectNumber);
            }
            set
            {
                AppSettings.AddOrUpdateValue<string>(AndroidProjectNumberKey, value);
            }
        }
        
        public static void RemoveAuth()
        {
            AppSettings.Remove(AuthKey);
            AppSettings.Remove(UserNameKey);
            AppSettings.Remove(UserIdKey);
            AppSettings.Remove(SigninProviderKey);
        }
    }
}