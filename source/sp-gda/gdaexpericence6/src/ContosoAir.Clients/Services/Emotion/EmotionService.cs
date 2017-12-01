using ContosoAir.Clients.Helpers;
using Microsoft.ProjectOxford.Emotion;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Services.Emotion
{
    public class EmotionService : IEmotionService
    {
        public async Task<float> GetHappinessAsync(Stream stream)
        {
            float happiness = 0.0f;

            var emotionClient = new EmotionServiceClient(Settings.CognitiveServicesKey);

            var emotionResults = await emotionClient.RecognizeAsync(stream);

            if (emotionResults == null || emotionResults.Count() == 0)
            {
                throw new Exception("Can't detect face!");
            }

            if(emotionResults.Any())
            {
                happiness = emotionResults.First().Scores.Happiness;
            }

            return happiness;
        }

        public async Task<float> GetAverageHappinessScoreAsync(Stream stream)
        {
            var emotionClient = new EmotionServiceClient(Settings.CognitiveServicesKey);

            var emotionResults = await emotionClient.RecognizeAsync(stream);

            if (emotionResults == null || emotionResults.Count() == 0)
            {
                throw new Exception("Can't detect face!");
            }

            float score = 0.0f;

            foreach (var emotionResult in emotionResults)
            {
                score = score + emotionResult.Scores.Happiness;
            }

            return score / emotionResults.Count();
        }
    }
}
