import { inject } from 'aurelia-framework';
import { viewEngineHooks } from 'aurelia-templating';
import { EventAggregator } from 'aurelia-event-aggregator';

enum GuideState
{
    Collapsed,
    Shown
}

@inject(EventAggregator)
export class Guide
{
    private ea: EventAggregator;

    constructor(eventAggregator: EventAggregator)
    {
        this.ea = eventAggregator;
    }

    tableOfContents =
    [
        { title: 'Creating a new collection', step: 1 },
        { title: 'Creating a node', step: 2 },
        { title: 'Creating an edge', step: 3 },
        { title: 'Add Node Properties', step: 4 },
        { title: 'Add Edge Properties', step: 5 }
    ]

    private state: GuideState = GuideState.Collapsed;
    get State(): GuideState
    {
        return this.state;
    }
    set State(value: GuideState)
    {
        this.state = value;
    }

    private stepIndex = 0;
    get Step(): number
    {
        return this.stepIndex;
    }
    set Step(value: number)
    {
        this.stepIndex = value;
    }

    get IsVisible(): boolean
    {
        return this.State !== GuideState.Collapsed;
    }

    close()
    {
        this.State = GuideState.Collapsed;
        this.ea.publish('setGuideState', false);
    }

    expand()
    {
        this.State = GuideState.Shown;
        this.ea.publish('setGuideState', true);
    }

    next()
    {
        this.stepIndex++;
    }

    prev()
    {
        this.stepIndex--;
    }
}

@viewEngineHooks()
export class GuideBinder
{
    beforeBind(view)
    {
        view.overrideContext.GuideState = GuideState;
    }
}