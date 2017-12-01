import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'utc'
})

/**Format the date without TimeZone info*/

export class UTCPipe implements PipeTransform {


    transform(value: string): any {


        if (value == '' || value == undefined)
            return '';

        var dateValue = new Date(value);
        var datewithouttimezone = new Date(dateValue.getUTCFullYear(),
            dateValue.getUTCMonth(),
            dateValue.getUTCDate(),
            dateValue.getUTCHours(),
            dateValue.getUTCMinutes(),
            dateValue.getUTCSeconds());
        return datewithouttimezone;
    }

}