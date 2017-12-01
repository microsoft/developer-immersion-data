import { bindable, inject } from 'aurelia-framework';
import JSONFormatter from 'json-formatter-js';

@inject(Element)
export class JsonFormatter
{
	// in markup, this variable is bindable by way of: json-data.bind="someObject"
	@bindable jsonData: any = null;

	// the element that will contain our pretty formatted JSON
    private element: HTMLElement;

	// the json formatter object itself
    private jsonFormatter: JSONFormatter;

	// create thyself!
	constructor(element)
	{
		this.element = element;
	}

	// the bindable is "jsonData" so by convention, when it changes, "jsonDataChanged" fires, passing in new and old values
	jsonDataChanged(newValue, oldValue)
    {
        if (newValue !== undefined)
		{
			this.jsonFormatter = new JSONFormatter(newValue, 1, { theme: 'dark' });
            this.element.replaceChild(this.jsonFormatter.render(), this.element.firstChild);
        }
        else
        {
            //clear contents
            this.element.innerHTML = '';
        }
	}
}