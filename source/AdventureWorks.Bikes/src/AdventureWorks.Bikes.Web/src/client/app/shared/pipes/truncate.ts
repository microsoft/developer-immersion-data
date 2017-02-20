
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: string, trail: string) : string {

    let limitInt = limit ? parseInt(limit, 10) : 10;
    trail = trail ? trail : '...';

    return value.length > limitInt ? value.substring(0, limitInt) + trail : value;

  }
}
