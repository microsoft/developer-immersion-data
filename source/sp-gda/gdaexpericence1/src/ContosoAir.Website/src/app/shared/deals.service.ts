import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Deal } from './deal';
import { environment } from '../../environments/environment';

@Injectable()
export class DealsService {
    private dealsUrl = environment.api_url + 'deals';
    constructor(private http: Http) { }

    // Request for deals data to service
    get(): Observable<Deal[]> {
        return this.http.get(this.dealsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Return deals data in proper format
    private extractData(res: Response) {
        let body = JSON.parse(res.json());
        console.log(body);
        return body || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}