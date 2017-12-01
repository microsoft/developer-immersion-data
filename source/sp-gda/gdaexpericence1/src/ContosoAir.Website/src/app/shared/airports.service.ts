import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Airport } from './airport';
import { environment } from '../../environments/environment';

@Injectable()
export class AirportsService {
    private airportsUrl = environment.api_url + 'airports';
    destination: any;

    constructor(private http: Http) {
        this.destination = {
            fromAirport: {
                code: 'BCN'
            },
            toAirport: {
                code: 'SEA'
            }
        }
    }

    get(): Observable<Airport[]> {
        return this.http.get(this.airportsUrl)
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
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}