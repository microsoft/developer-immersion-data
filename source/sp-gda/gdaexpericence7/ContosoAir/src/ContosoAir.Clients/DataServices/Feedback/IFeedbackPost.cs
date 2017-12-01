using ContosoAir.Clients.Models;
using ContosoAir.Clients.DataServices.Feedback;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContosoAir.Clients.DataServices.Feedback
{
    public interface IFeedbackPost
    {
        Task <IEnumerable<FlightData>> GetFlight();

        Task<FlightFeedbackData> PutAsync<FlightFeedbackData>(string uri, FlightFeedbackData ffd);

    }
}
