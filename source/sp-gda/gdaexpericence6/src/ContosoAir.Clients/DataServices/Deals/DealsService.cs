using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ContosoAir.Clients.Models;
using ContosoAir.Clients.DataServices.Base;
using ContosoAir.Clients.Helpers;

namespace ContosoAir.Clients.DataServices.Deals
{
    public class DealsService : IDealsService
    {
        private readonly IRequestProvider _requestProvider;

        public DealsService(IRequestProvider requestProvider)
        {
            _requestProvider = requestProvider;
        }

        public async Task<IEnumerable<Deal>> GetDealsAsync()
        {
            UriBuilder builder = new UriBuilder(Settings.ContosoAirEndpoint);
            builder.Path = "api/deals";

            string uri = builder.ToString();

            IEnumerable<Deal> deals = await _requestProvider.GetAsync<IEnumerable<Deal>>(uri);

            // Some data hacking for demo purpouses
            deals = DealsDemoFixUpHelper.FixData(deals);

            return deals;
        }
    }
}