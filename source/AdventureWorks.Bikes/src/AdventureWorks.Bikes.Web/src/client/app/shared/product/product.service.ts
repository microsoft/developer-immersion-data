import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Product} from './product.entity';
import {APIConfig} from '../api.config';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class ProductService {

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
  getAll(limit:number=4): Observable<Product[]> {

    return this.http.get(this.config.ROOT_URL + 'Products/latest?count=' + limit)
                    .map((response: Response) => {
                      let result = response.json();
                      return result.length ? result : [];
                    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  getHighlighted(limit:number=4): Observable<Product[]> {

    return this.http.get(this.config.ROOT_URL + 'Products/highlighted?count=' + limit)
                    .map((response: Response) => {
                      let result = response.json();
                      return result.length ? result : [];
                    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  getFromStore(storeId:number, limit:number=4): Observable<Product[]> {

    return this.http.get(this.config.ROOT_URL + 'Products/store/'+storeId+'?count=' + limit)
                    .map((response: Response) => {
                      let result = response.json();
                      return result.length ? result : [];
                    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  search(term:String, limit:number=4): Observable<Product[]> {

    return this.http.get(this.config.ROOT_URL + 'Products/all/'+term+'?count=' + limit)
                    .map((response: Response) => {
                      let result = response.json();
                      return result.length ? result : [];
                    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  getRelated(term:String, limit:number=4): Observable<number[]> {

    return this.http.get(this.config.ROOT_URL + 'Products/recommendations/'+term+'?count=' + limit)
                    .map((response: Response) => {
                      let result = response.json();
                      return result.length ? result : [];
                    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store} The Observable for the HTTP request.
   */
  get(id:number): Observable<Product> {

    return this.http.get(this.config.ROOT_URL + 'Products/' + id)
                    .map((response: Response) => response.json());
  }

  getImageUrl(id:number):String {
    return this.config.ROOT_URL + 'Products/picture/' + id;
  }

}
