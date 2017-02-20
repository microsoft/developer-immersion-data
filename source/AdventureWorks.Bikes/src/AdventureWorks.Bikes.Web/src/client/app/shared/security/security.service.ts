import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {APIConfig} from '../api.config';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

@Injectable()
export class SecurityService {

  Token:String;

  User:any=null;

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http, private config:APIConfig) {}


  /**
   * 
   */
  getTokenRequest(User:String, Password:String):Observable<any> {

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      return this.http.post(this.config.ROOT_TOKEN_URL
                                         + 'connect/token'
                                         , 'username=' + User
                                         + '&password=' + Password
                                         + '&scope=api&client_id=Bikes&grant_type=password&client_secret=secret' , new RequestOptions({
                                             headers: headers
                                         }))
                    .map((response: Response) => response.json());
  }

  /**
   * 
   */
  getRequestHeaders():Headers {
      let headers = new Headers();
      headers.append('Authorization', 'bearer ' + this.Token);

      return headers;
  }


  getUser() {

        return this.http.get(this.config.ROOT_URL + 'users/user', new RequestOptions({
                               headers: this.getRequestHeaders()
                    }))
                    .map((response: Response) => response.json());
  }

}
