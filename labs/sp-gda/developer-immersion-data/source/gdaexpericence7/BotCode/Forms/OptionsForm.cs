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
    public class OptionsForm
    {
        [Describe(Locale.AnOption)]
        public string InitialOption;
        public string Menu;
        public bool NeedMap;
        

        public static IForm<OptionsForm> BuildForm(MenuOptions MenuOption)
        {
            return new FormBuilder<OptionsForm>()
                .Field(nameof(InitialOption), validate: (state, value) =>
                {

                    string regexPattern = @"\d+";
                    Regex r = new Regex(regexPattern, RegexOptions.IgnoreCase | RegexOptions.Singleline);
                    Match m = r.Match(value.ToString());

                    if (m.Success)
                    {
                        state.Menu = m.Value;
                        
                    }

                    return Task.FromResult(new ValidateResult { IsValid = true, Value = state.Menu });
                }, active: (state) =>
                {
                    return string.IsNullOrEmpty(state.Menu);
                })
                // Show Buttons to choose flight
                .Field(new FieldReflector<OptionsForm>(nameof(Menu))
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

                        if (m.Success && number <= MenuOption.Options.Count())
                        {
                            state.Menu = m.Value;
                            return Task.FromResult(new ValidateResult { IsValid = true, Value = state.Menu });
                        }

                        state.Menu = Constants.DefaultOption;
                        return Task.FromResult(new ValidateResult { IsValid = false, Value = Constants.DefaultOption });
                    })
                    .SetDefine((state, field) =>
                    {
                        MenuOption.Options.ForEach(MenuOptions =>
                        {
                            var id = $"{MenuOptions.Id}";
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
                    var selected = MenuOption.Options.FirstOrDefault(x => $"{x.Id}" == state.Menu);
                    return Task.FromResult(new PromptAttribute(ConfirmTemplate(selected)));
                })
                .Confirm((state) =>
                {
                    var selected = MenuOption.Options.FirstOrDefault(x => $"{x.Id}" == state.Menu);
                    return Task.FromResult(new PromptAttribute(Locale.ConfirmButtons));
                })
                .Build();
        }


        private static string ConfirmTemplate(Options flightOptions)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Selected Option : "+flightOptions.Title);
            return sb.ToString();
        }
    }

};