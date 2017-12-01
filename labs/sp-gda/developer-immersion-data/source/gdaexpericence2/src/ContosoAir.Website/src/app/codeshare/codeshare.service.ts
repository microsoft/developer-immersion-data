import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Edges } from './edges';
import { Vertices } from './vertices';
import { environment } from '../../environments/environment';
import { BookingService } from '../shared/booking.service';

@Injectable()
export class CodeshareService {
    private codeshareEdgesUrl = environment.api_url + 'codeshare/edges';
    private codeshareVerticesUrl = environment.api_url + 'codeshare/vertices';
    private codeshareSoloserviceUrl = environment.api_url + 'codeshare/';
    
    public flightId: any;
    public serviceName: any;  
    serviceData: any;
    constructor(private http: Http, private bookingService: BookingService) {}
    
    get(id: string, service: string): Observable<JSON> {
        return this.http.get(this.codeshareSoloserviceUrl + id + '/' + service)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEdges(): Observable<Edges[]> {
        return this.http.get(this.codeshareEdgesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVertices(): Observable<Vertices[]> {
        return this.http.get(this.codeshareVerticesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: Response | any) {
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