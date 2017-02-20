import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Store} from './store.entity';
import {SecurityService} from '../security/security.service';
import {APIConfig} from '../api.config';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class StoreService {

  CityName = 'Redmond, Washington, USA';
  CityCoords = { lat: 40.631847, lon: -74.007326 };

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http, private config:APIConfig) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  getAll(limit:Number=4): Observable<Store[]> {

    return this.http.get(this.config.ROOT_URL + 'Stores/all?count=' + limit)
                    .map((response: Response) => {
                      let result = response.json();
                      return result.length ? result : [];
                    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  getNearBy(limit:Number=4): Observable<Store[]> {

    return this.http.get(this.config.ROOT_URL + 'Stores/nearby?count=' + limit
                                              + '&latitude=' + this.CityCoords.lat
                                              + '&longitude=' + this.CityCoords.lon)
                    .map((response: Response) => {
                      let result = response.json();
                      return result.length ? result : [];
                    });
  }


  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store} The Observable for the HTTP request.
   */
  get(id:number): Observable<Store> {

    return this.http.get(this.config.ROOT_URL + 'Stores/' + id)
                    .map((response: Response) => response.json());
  }

  getImageUrl(id:number, position:number=1):String {
    return this.config.ROOT_URL + 'Stores/picture/' + id + '?position=' + position;
  }

  getUserStore(securityService:SecurityService): Observable<Store> {

    return this.http.get(this.config.ROOT_URL + 'Users/user/store/', securityService.getRequestHeaders())
                    .map((response: Response) => response.json());

  }



}
