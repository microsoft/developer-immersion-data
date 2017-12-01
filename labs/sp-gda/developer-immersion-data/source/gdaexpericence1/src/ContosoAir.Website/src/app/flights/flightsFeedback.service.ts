import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Feedback } from './feedback';

@Injectable()
export class FlightsFeedbackService {

    private flightsFeedbackUrl = environment.api_url + 'flights/feedback';

    constructor(private http: Http) { }
    // Get flight feedback according to flight number
    get(flightNo): Observable<Feedback[]> {
        return this.http.get(this.flightsFeedbackUrl + '/' + flightNo)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
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
        console.log(errMsg);
        return Observable.throw(errMsg);
    }
}