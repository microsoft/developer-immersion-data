using ContosoAir.Clients.Services.Dialog;
using ContosoAir.Clients.Services.Navigation;
using System;
using System.Threading.Tasks;

namespace ContosoAir.Clients.ViewModels.Base
{
    public class ViewModelBase : ExtendedBindableObject, IDisposable
    {
        protected readonly IDialogService DialogService;
        protected readonly INavigationService NavigationService;

        private bool _isBusy;

        public bool IsBusy
        {
            get
            {
                return _isBusy;
            }

            set
            {
                _isBusy = value;
                RaisePropertyChanged(() => IsBusy);
            }
        }

        public ViewModelBase()
        {
            DialogService = ViewModelLocator.Instance.Resolve<IDialogService>();
            NavigationService = ViewModelLocator.Instance.Resolve<INavigationService>();
        }

        public virtual Task InitializeAsync(object navigationData)
        {
            return Task.FromResult(false);
        }

        public virtual void Dispose()
        {
        }
    }
}
