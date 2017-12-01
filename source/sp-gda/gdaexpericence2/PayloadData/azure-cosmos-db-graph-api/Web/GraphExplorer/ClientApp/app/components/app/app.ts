import { Aurelia, inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class App 
{
    router: Router;
    showGuide: boolean = false;

    private ea: EventAggregator;

    constructor(eventAggregator: EventAggregator)
    {
        this.ea = eventAggregator;

        this.ea.subscribe('setGuideState', response =>
        {
            this.showGuide = response;
        });
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Microsoft';
        config.map([{
			route: [ '', 'network' ],
			name: 'network',
			moduleId: '../network/network',
			nav: true,
			title: 'Azure Graph Explorer'
		}]);

        this.router = router;
    }
}
