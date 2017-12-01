using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Dialogs;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;
using System.Configuration;
using Microsoft.Bot.Builder.FormFlow;
using SimpleEchoBot.Models;
using SimpleEchoBot.Forms;

namespace SimpleEchoBot.Dialogs
{
    [Serializable]
    public class AlternateFlights : IDialog<FlightOptionForm>
    {
               
        private FlightOptions flightOptions = null;
        private Alternatives alternatives = null;
        public string PNRCode = null;

        public async Task StartAsync(IDialogContext context)
        {
            this.PNRCode = ((Activity)((Microsoft.Bot.Builder.Dialogs.IBotContext)context).Activity).Text;
            await this.CallAlternateFlights(context);
        }

        //Function to Get Alternative Flight Data From DocumentDb
        public async Task CallAlternateFlights(IDialogContext context)
        {
            try
            {
                IEnumerable<Alternatives> alternativesdata = null;
                this.alternatives = null;
                using (var httpClient = new HttpClient())
                {
                    var response = await httpClient.GetAsync(ConfigurationManager.AppSettings[Constants.KeyApi] + "/alternatives/" + this.PNRCode);
                    object DeserializeResult = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());
                    alternativesdata = JsonConvert.DeserializeObject<IEnumerable<Alternatives>>(DeserializeResult.ToString());

                }
                foreach (Alternatives alternateFlights in alternativesdata)
                {
                    this.alternatives = alternateFlights;
                }


                if (this.alternatives != null)
                    await this.DisplayAlternateFlights(context);
                else
                {
                    await context.PostAsync(Locale.AlternativeFlightErrorMsg);
                    context.Wait(OnComplete);
                }

            }
            catch (Exception ex)
            {
                await context.PostAsync($"Failed with message: {ex.Message}");
            }

        }

        //Function to Display Alternative Flights Data
        public async Task DisplayAlternateFlights(IDialogContext context)
        {
                    
            var message = context.MakeMessage();
            var attachments = new List<Attachment>();

            try
            {
                foreach (var flight in this.alternatives.Flights)
                {
                    List<CardImage> cardImages = new List<CardImage>();
                    using (var webClient = new WebClient())
                    {
                        var image64 = Convert.ToBase64String(flight.Image, Base64FormattingOptions.InsertLineBreaks);
                        cardImages.Add(new CardImage(url: $"data:image/png;base64,{image64}"));
                    }
                    var cardButtons = new List<CardAction>();
                    var option = string.Format(Locale.Options_Option, flight.Id);

                    cardButtons.Add(new CardAction(type: ActionTypes.ImBack, value: option, title: option));

                    HeroCard plCard = new HeroCard()
                    {
                        Title = Constants.Choose,
                        Images = cardImages,
                        Buttons = cardButtons
                    };
                    Attachment plAttachment = plCard.ToAttachment();
                    attachments.Add(plAttachment);
                }

                message.Attachments = attachments;
                message.AttachmentLayout = AttachmentLayoutTypes.Carousel;
                await context.PostAsync(message);

                var flightForm = new FormDialog<FlightOptionForm>(new FlightOptionForm(), () => FlightOptionForm.BuildForm(this.alternatives));
                context.Call(flightForm, OnCompleteOptionsForm);
            }
            catch (Exception ex)
            {
                await context.PostAsync($"Failed with message: {ex.Message}");
            }

        }

        //Function call After user click on any of Alternative Flight
        private async Task OnCompleteOptionsForm(IDialogContext context, IAwaitable<FlightOptionForm> result)
        {

            var messagedata = await result;    
            this.flightOptions = new FlightOptions();
            this.flightOptions.Map = messagedata.Map;
            this.flightOptions.Id = messagedata.FlightID;

            // Confirm if needs a map
            PromptDialog.Confirm(context, ShowMapIfNeeded, Locale.ConfirmMap);
        }

        //Function to Display Terminal Map
        public async Task ShowMapIfNeeded(IDialogContext context, IAwaitable<bool> result)
        {
            var res = await result;
            if (res)
            {

                await context.PostAsync(Locale.ByeNoImage);
                var message = context.MakeMessage();
                var attachments = new List<Attachment>();
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
                await context.PostAsync(Locale.ByeNoImage);
            
            try
            {
                using (var httpClient = new HttpClient())
                {
                    Random random = new Random();
                    string NewPNRCode = "contoso" + random.Next(10000);
                    string currDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
                    string parameters = this.PNRCode + "/" + NewPNRCode + "/" + this.alternatives.from + "/" + this.alternatives.to + "/" + this.flightOptions.Id+"/"+ currDate;
                    var response = await httpClient.GetAsync(ConfigurationManager.AppSettings[Constants.KeyApi] + "/insert/" + parameters);
                    object DeserializeResult = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());

                }
            }
            catch (Exception ex)
            {
                await context.PostAsync($"Failed with message: {ex.Message}");
            }
            finally
            {
                context.Wait(OnComplete);
            }
        }

        //Function will call after Flight Rescheduling Process Done
        private Task OnComplete(IDialogContext context, IAwaitable<object> argument)
        {
            this.PNRCode = null;
            context.Done(true);
            return Task.FromResult(true);
        }
    }

}