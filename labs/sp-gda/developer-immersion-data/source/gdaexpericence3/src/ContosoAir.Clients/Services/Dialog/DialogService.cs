using Acr.UserDialogs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Dialog
{
    public class DialogService : IDialogService
    {
        public Task ShowAlertAsync(string message, string title, string buttonLabel)
        {
            return UserDialogs.Instance.AlertAsync(message, title, buttonLabel);
        }

        public Task<bool> ShowConfirmAsync(string message, string title, string okLabel, string cancelLabel)
        {
            return UserDialogs.Instance.ConfirmAsync(message, title, okLabel, cancelLabel);
        }

        public Task<string> SelectActionAsync(string message, string title, IEnumerable<string> options)
        {
            return SelectActionAsync(message, title, "Cancel", options);
        }

        public async Task<string> SelectActionAsync(string message, string title, string cancelLabel, IEnumerable<string> options)
        {
            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            if (!options.Any())
            {
                throw new ArgumentException("No options provided", nameof(options));
            }

            string result = await UserDialogs.Instance.ActionSheetAsync(message, cancelLabel, null, buttons: options.ToArray());

            return options.Contains(result)
                ? result
                : cancelLabel;
        }
    }
}