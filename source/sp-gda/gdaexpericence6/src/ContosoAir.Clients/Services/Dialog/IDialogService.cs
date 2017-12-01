using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Dialog
{
    public interface IDialogService
    {
        Task ShowAlertAsync(string message, string title, string buttonLabel);

        Task<bool> ShowConfirmAsync(string message, string title, string okLabel, string cancelLabel);

        Task<string> SelectActionAsync(string message, string title, IEnumerable<string> options);

        Task<string> SelectActionAsync(string message, string title, string cancelLabel, IEnumerable<string> options);
    }
}