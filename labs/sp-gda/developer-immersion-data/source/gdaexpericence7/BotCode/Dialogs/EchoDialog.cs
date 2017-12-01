using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Dialogs;
using System.Net.Http;
using Newtonsoft.Json;
using SimpleEchoBot.Models;
using System.Configuration;
using Microsoft.Bot.Builder.FormFlow;
using System.Text;
using System.Threading;
using SimpleEchoBot.Forms;

namespace SimpleEchoBot.Dialogs
{
    [Serializable]
    public class EchoDialog : IDialog<OptionsForm>
    {

        public string PNRCode = null;     

        public async Task StartAsync(IDialogContext context)
        {
           await this.MenuOptions(context);
        }
        //Function to Display Option Menu
        private async Task MenuOptions(IDialogContext context)
        {
            var message = context.MakeMessage();
            var name = message.Recipient != null ? message.Recipient.Name : "";           
            await context.PostAsync(String.Format(Locale.Greet, name));

            var attachments = new List<Attachment>();      
            MenuOptions MenuOption = new MenuOptions();
            
            MenuOption.Options.Add(new Options(1, "E-Checkin"));
            MenuOption.Options.Add(new Options(2, "Terminal Map"));
            MenuOption.Options.Add(new Options(3, "Flight Resechedule"));
                  
            foreach (Options optionsdata in MenuOption.Options)
            {
                List<CardImage> cardImages = new List<CardImage>();

                var cardButtons = new List<CardAction>();
                var option = string.Format(Locale.Options_Option, optionsdata.Id);

                cardButtons.Add(new CardAction(type: ActionTypes.ImBack, value: option, title: option));

                HeroCard plCard = new HeroCard()
                {
                    Title = optionsdata.Title,                     
                    Text = Constants.Choose,
                    Buttons = cardButtons
                };
                Attachment plAttachment = plCard.ToAttachment();
                attachments.Add(plAttachment);
            }

            message.Attachments = attachments;
            message.AttachmentLayout = AttachmentLayoutTypes.Carousel;

            await context.PostAsync(message);
            var flightForm = new FormDialog<OptionsForm>(new OptionsForm(), () => OptionsForm.BuildForm(MenuOption));
            context.Call(flightForm, OnCompleteMenuOptionsForm);

        }
        //Function to Call Once user click on Any of Menu Option
        private async Task OnCompleteMenuOptionsForm(IDialogContext context, IAwaitable<OptionsForm> result)
        {

            var messagedata = await result;
            int number = Convert.ToInt32(messagedata.Menu);
            await context.PostAsync(Locale.AskQuestion);
            
            if (number == 1)
                context.Wait(ConfirmECheckin);
            else if (number == 2)
                context.Wait(ShowMapOption);
            else if (number == 3)
                context.Wait(FlightReschedule);

        }

        //Function to call Another Dialog for Flight Reschedule
        public async Task FlightReschedule(IDialogContext context, IAwaitable<IMessageActivity> argument)
        {
            var message = await argument; // We've got a message!         
            await context.Forward(new AlternateFlights(), this.onAlternateFlightComplete, message, CancellationToken.None);

        }
        public async Task onAlternateFlightComplete(IDialogContext context, IAwaitable<object> argument)
        {
            context.Wait(this.OnComplete);
        }
        //Function to Display Map
        public async Task ShowMapOption(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var res = await result;
            var PNRCode = res.Text;
            var message = context.MakeMessage();
            if (res.Text != "")
            {
                var attachments = new List<Attachment>();
                try
                {
                    IEnumerable<FlightOptions> flightOptionsdata = null;
                    FlightOptions flightOptions = null;
                    using (var httpClient = new HttpClient())
                    {
                        var response = await httpClient.GetAsync(ConfigurationManager.AppSettings[Constants.KeyApi] + "/terminalmap/" + PNRCode);
                        object DeserializeResult = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());
                        flightOptionsdata = JsonConvert.DeserializeObject<IEnumerable<FlightOptions>>(DeserializeResult.ToString());
                    }

                    foreach (FlightOptions flightobj in flightOptionsdata)
                    {
                        flightOptions = flightobj;
                    }
                    if (flightOptions != null)
                    {
                        await context.PostAsync(Locale.ByeImage);
                        var image64 = Convert.ToBase64String(flightOptions.Map, Base64FormattingOptions.InsertLineBreaks);
                        var attachment = new Attachment();
                        attachment = new Attachment()
                        {
                            ContentType = Constants.PNGType,
                            ContentUrl = $"data:image/png;base64,{image64}",
                            Name = "TerminalMap.png"
                        };
                        attachments.Add(attachment);
                        message.Attachments = attachments;
                        await context.PostAsync(message);
                    }
                    else
                        await context.PostAsync(Locale.NoTerminalMapFound);

                }
                catch (Exception ex)
                {
                    await context.PostAsync($"Failed with message: {ex.Message}");
                }
            }
            else
                await context.PostAsync(Locale.ByeNoImage);

            context.Wait(OnComplete);
        }
       
        //Function to call Confirm E-Checkin
        public async Task ConfirmECheckin(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var res = await result;
            if (res.Text != "")
            {
                this.PNRCode = res.Text;
                PromptDialog.Confirm(context, ECheckinAfterConfirm, Locale.ConfirmECheckin);
            }
        }
        //Call E-Checkin Function After User Confirmation
        public async Task ECheckinAfterConfirm(IDialogContext context, IAwaitable<bool> result)
        {
            var res = await result;
            if (res)
            {
                var message = context.MakeMessage();
                var attachments = new List<Attachment>();
                try
                {
                    IEnumerable<FlightOptions> flightOptionsdata = null;
                    FlightOptions flightOptions = null;
                    using (var httpClient = new HttpClient())
                    {
                        var response = await httpClient.GetAsync(ConfigurationManager.AppSettings[Constants.KeyApi] + "/echeckin/" + this.PNRCode);
                        object DeserializeResult = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());
                        flightOptionsdata = JsonConvert.DeserializeObject<IEnumerable<FlightOptions>>(DeserializeResult.ToString());
                    }
                    foreach (FlightOptions flightobj in flightOptionsdata)
                    {
                        flightOptions = flightobj;
                    }

                    if (flightOptions != null)
                    {
                        if (flightOptions.Flag)
                            await context.PostAsync(Locale.NewECheckin+" "+ Locale.ShowBoarding);
                        else
                            await context.PostAsync(Locale.OldECheckin + " " + Locale.ShowBoarding);
                                                
                        var image64 = Convert.ToBase64String(flightOptions.BoardingPass, Base64FormattingOptions.InsertLineBreaks);
                        var attachment = new Attachment();
                        attachment = new Attachment()
                        {
                            ContentType = Constants.PNGType,
                            ContentUrl = $"data:image/png;base64,{image64}",
                            Name = "BoardingPass.png"
                        };
                        attachments.Add(attachment);

                        message.Attachments = attachments;
                        await context.PostAsync(message);
                    }
                    else
                    {
                        await context.PostAsync(Locale.ECheckinErrorMsg);
                    }
                }
                catch (Exception ex)
                {
                    await context.PostAsync($"Failed with message: {ex.Message}");
                }

            }
            context.Wait(OnComplete);
        }
        //Function will Call after Particular process compeleted
        private Task OnComplete(IDialogContext context, IAwaitable<object> argument)
        {
            this.PNRCode = null;
            context.Done(true);
            return Task.FromResult(true);
        }
    }


}