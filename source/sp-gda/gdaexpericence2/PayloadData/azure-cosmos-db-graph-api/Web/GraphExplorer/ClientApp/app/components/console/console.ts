import { viewEngineHooks } from 'aurelia-templating';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

enum ConsoleState
{
	Default,
	Collapsed,
	Full
}

enum ConsoleMode
{
	Standard,
	Json
}

@inject(EventAggregator)
export class Console
{
    showGuide: boolean = false;
	private consoleOutput: HTMLElement;
    private messageList: any[] = [];
    private rawDataList: any[] = [];
    private ea: EventAggregator;
	
	constructor(eventAggregator: EventAggregator)
	{
        this.ea = eventAggregator;

        this.ea.subscribe('setGuideState', response =>
        {
            this.showGuide = response;
        });
    }
    
	private mode: ConsoleMode = ConsoleMode.Standard;
	get Mode(): ConsoleMode
	{
		return this.mode;
	}

	set Mode(value: ConsoleMode)
	{
		this.mode = value;
	}

	private state: ConsoleState = ConsoleState.Collapsed;
	get State(): ConsoleState
	{
		return this.state;
	}
	set State(value: ConsoleState)
	{
		this.state = value;
	}

	get IsVisible(): boolean
	{
		return this.State !== ConsoleState.Collapsed;
	}

	collapse()
	{
		this.State = ConsoleState.Collapsed;
	}

	expand()
	{
		this.State = this.State == ConsoleState.Default ? ConsoleState.Full : ConsoleState.Default;
    }

    default()
    {
        this.State = ConsoleState.Default;
    }

	write(data: any, input: boolean = true)
	{
		// cheap analysis of data to see if we can determine what we've got, in order to display it all pretty and stuff
		if (!input && data && data.length)
        {
			let messageType = 'output';
			
			switch (data[0].type)
			{
				case 'vertex':
					for (let v of data)
					{
						let edgeString: string[] = [];
						for (let eType in v.outE)
						{
							let tmp: string = 'e:' + eType + '=' + v.outE[eType].length;
							edgeString.push(tmp);
						}
						this.messageList.push({ text: 'v[' + v.label + ']->' + edgeString.join(','), type: messageType });
					}
					break;

				case 'edge':
					for (let e of data)
					{
						this.messageList.push({ text: 'e[' + e.label + ']->v[' + e.outVLabel + ']', type: messageType });
					}
					break;

				default:
					this.messageList.push({ text: JSON.stringify(data), messageType });
					break;
            }

            this.rawDataList.push({ data: data, type: 'output' });
		}
		else
        {
            if (typeof data === 'object')
            {
                this.messageList.push({ text: JSON.stringify(data), type: 'output' });
                this.rawDataList.push({ data: data, type: 'output' });
            }
            else
            {
                this.messageList.push({ text: data, type: 'input' });
                this.rawDataList.push({ data: data, type: 'input' });
            }
            
		}

        this.ea.publish('consoleupdate', this.messageList[this.messageList.length - 1]);

		setTimeout(() =>
		{
			this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
		},0);
	}

	clear()
	{
		this.messageList = [];
        this.consoleOutput.scrollTop = 0;
        this.rawDataList = [];
	}
}

@viewEngineHooks()
export class ConsoleBinder
{
	beforeBind(view)
	{
		view.overrideContext.ConsoleState = ConsoleState;
		view.overrideContext.ConsoleMode = ConsoleMode;
	}
}