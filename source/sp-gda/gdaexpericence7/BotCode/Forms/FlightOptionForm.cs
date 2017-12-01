using System;
using System.Linq;
using Microsoft.Bot.Builder.FormFlow;
using Microsoft.Bot.Builder.FormFlow.Advanced;
using System.Text.RegularExpressions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Bot.Sample.SimpleEchoBot;
using SimpleEchoBot.Models;

namespace SimpleEchoBot.Forms
{
    [Serializable]
    public class FlightOptionForm
    {
        [Describe(Locale.AnOption)]
        public string InitialFlight;
        public string Flight;        
        public byte[] BoardingPass;
        public byte[] Map;
        public int FlightID;

        public static IForm<FlightOptionForm> BuildForm(Alternatives AlternativesData)
        {
            return new FormBuilder<FlightOptionForm>()
                .Field(nameof(InitialFlight), validate: (state, value) =>
                {

                    string regexPattern = @"\d+";
                    Regex r = new Regex(regexPattern, RegexOptions.IgnoreCase | RegexOptions.Singleline);
                    Match m = r.Match(value.ToString());

                    if (m.Success)
                    {
                        state.InitialFlight = m.Value;
                        state.Flight = m.Value;
                    }

                    state.InitialFlight = value as string;
                    return Task.FromResult(new ValidateResult { IsValid = true, Value = state.InitialFlight });
                }, active: (state) =>
                {
                    return string.IsNullOrEmpty(state.Flight);
                })
                // Show Buttons to choose flight
                .Field(new FieldReflector<FlightOptionForm>(nameof(Flight))
                    .SetType(null) // List
                    .SetValidate((state, value) =>
                    {

                        string regexPattern = @"\d+";
                        Regex r = new Regex(regexPattern, RegexOptions.IgnoreCase | RegexOptions.Singleline);
                        Match m = r.Match(value.ToString());
                        int number = -1;

                        if (m.Success)
                        {
                            number = int.Parse(m.Value);
                        }

                        if (m.Success && number <= AlternativesData.Flights.Count())
                        {
                            state.Flight = m.Value;
                            return Task.FromResult(new ValidateResult { IsValid = true, Value = state.Flight });
                        }

                        state.Flight = Constants.DefaultOption;
                        return Task.FromResult(new ValidateResult { IsValid = false, Value = Constants.DefaultOption });
                    })
                    .SetDefine((state, field) =>
                    {
                        AlternativesData.Flights.ForEach(flightOptions =>
                        {
                            var id = $"{flightOptions.Id}";
                            var buttonText = $"Option {id}";

                            field
                            .AddDescription(id, buttonText)
                            .AddTerms(id, id, $".+( {id}).+", $"( {id}).+", $".+( {id})");
                        });

                        return Task.FromResult(true);
                    }))

                // Confirm the selection
                .Message((state) =>
                {
                    var selected = AlternativesData.Flights.FirstOrDefault(x => $"{x.Id}" == state.Flight);
                    return Task.FromResult(new PromptAttribute(ConfirmTemplate(selected)));
                })
                .Confirm((state) =>
                {
                    var selected = AlternativesData.Flights.FirstOrDefault(x => $"{x.Id}" == state.Flight);
                    state.BoardingPass = selected.BoardingPass;
                    state.Map = selected.Map;
                    state.FlightID = selected.Id;
                    return Task.FromResult(new PromptAttribute(Locale.ConfirmButtons));
                })
                .Build();
        }

        private static string FlightTemplate(FlightOptions flightOptions)
        {
            var sb = new StringBuilder();
            sb.AppendLine(Constants.EmptyLine);
            sb.AppendLine(string.Format(Locale.Options_Option_Bold, flightOptions.Id));
            sb.AppendLine(Constants.EmptyLine);

            sb.AppendLine(Locale.Options_Departure);
            sb.AppendLine(flightOptions.Departure);
            sb.AppendLine(Constants.EmptyLine);

            sb.AppendLine(Locale.Options_Arrival);
            sb.AppendLine(flightOptions.Arrival);
            sb.AppendLine(Constants.EmptyLine);

            var stops = Locale.Options_Nonstop;
            if (flightOptions.Stops > 0)
            {
                stops = $"{flightOptions.Stops} {Locale.Stop}";
            }

            if (flightOptions.Stops > 1)
            {
                stops = $"{stops}s";
            }

            sb.AppendLine(stops);

            return sb.ToString();
        }

        private static string ConfirmTemplate(FlightOptions flightOptions)
        {
            var sb = new StringBuilder();
            
            sb.AppendLine(Locale.BookingFrom);

            sb.AppendLine(FlightTemplate(flightOptions));

            sb.AppendLine(Constants.EmptyLine);

            return sb.ToString();
        }
    }
}