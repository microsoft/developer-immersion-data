import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {SecurityService} from '../security/security.service';
import {OrderList} from './order-list.entity';
import {CustomerList} from './customer-list.entity';
import {APIConfig} from '../api.config';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class OrderService {

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http, private config:APIConfig, private security:SecurityService) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  getAll(limit:Number=12): Observable<OrderList[]> {

    return this.http.get(this.config.ROOT_URL + 'orders/all?count=' + limit, new RequestOptions({
                        headers: this.security.getRequestHeaders()
                    }))
                    .map((response: Response) => {

                       let list = new Array<OrderList>();

                       response.json().forEach(
                         (item:OrderList) => {
                           let orderItem = new OrderList();
                           orderItem.hidrate(item);
                           list.push(orderItem);
                         }
                       );

                       return list;

                    });
  }


  /**
   * Returns an Observable for the HTTP GET request for the JSON resource. 
   * @return {Store[]} The Observable for the HTTP request.
   */
  getAllCustomers(limit:Number=12): Observable<CustomerList[]> {

    return this.http.get(this.config.ROOT_URL + 'customers/all?count=' + limit, new RequestOptions({
                        headers: this.security.getRequestHeaders()
                    }))
                    .map((response: Response) => {

                       let list = new Array<CustomerList>();

                       response.json().forEach(
                         (item:CustomerList) => {
                           let customerItem = new CustomerList();
                           customerItem.hidrate(item);
                           list.push(customerItem);
                         }
                       );

                       return list;

                    });
  }

  /**
* Returns an Observable for the HTTP GET request for the JSON resource. 
* @return {Store[]} The Observable for the HTTP request.
*/
  getCustomersByName(name: string, limit: Number = 12): Observable<CustomerList[]> {

      return this.http.get(this.config.ROOT_URL + 'customers/all?count=' + limit + '&name=' + name, new RequestOptions({
          headers: this.security.getRequestHeaders()
      }))
          .map((response: Response) => {

              let list = new Array<CustomerList>();

              response.json().forEach(
                  (item: CustomerList) => {
                      let customerItem = new CustomerList();
                      customerItem.hidrate(item);
                      list.push(customerItem);
                  }
              );

              return list;

          });
  }


}
