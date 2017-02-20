import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import {OrderService} from '../shared/order/order.service';
import {OrderList} from '../shared/order/order-list.entity';
import {CustomerList} from '../shared/order/customer-list.entity';
import {SecurityService} from '../shared/security/security.service';
import {Store} from '../shared/store/store.entity';
import {StoreService} from '../shared/store/store.service';
import {MessageService} from '../shared/message/message.service';
import { StoreHeaderComponent } from '../+store/header.component';

@Component({
  moduleId: module.id,
  selector: 'aw-backoffice',
  templateUrl: 'store.component.html',
  providers: [OrderService, StoreService],
  directives: [ROUTER_DIRECTIVES, StoreHeaderComponent]
})
export class BackofficeStoreComponent implements OnInit {

  Orders:OrderList[] = [];
  Customers:CustomerList[] = [];
  Store:Store=null;
  Section:String='';

  LoadingOrders=false;
  LoadingCustomers=false;

  constructor(public orderService:OrderService,
            public security:SecurityService,
            public router:Router,
            public storeService:StoreService,
            public globalMessages:MessageService) {

              this.Section = 'orders';
  }

  ngOnInit() {


    if(!this.security.User) {
      this.router.navigate( ['/'] );
    } else {
      this.LoadStore();
      this.LoadOrders();
    }
  }

  LoadStore():void {

      if(this.security.User.store) {
        this.Store = this.security.User.store;
      } else {
        this.storeService.getUserStore(this.security)
           .subscribe( store => {
              this.security.User.store = store;
              this.Store = store;
        });
      }

  }

  LoadOrders() {
    this.LoadingOrders = true;
    this.Orders = [];
    this.orderService.getAll().subscribe(list => {
        this.Orders = list;
        this.LoadingOrders = false;
    }, (error) => {
      if(error === 500) {
        this.globalMessages.ErrorMessages.push('Server connection error');
      }
      this.LoadingOrders = false;
    });
  }

  LoadCustomers() {
    this.LoadingCustomers = true;
    this.Customers = [];
    this.orderService.getAllCustomers().subscribe(list => {


        this.Customers = list;
        this.LoadingCustomers = false;



    }, (error) => {

      if(error === 500) {
        this.globalMessages.ErrorMessages.push('Server connection error');
      }

      this.LoadingCustomers = false;
    });
  }

  LoadCustomersByName(event: any) {
      var filterText = event.target.value;
      this.LoadingCustomers = true;
      this.Customers = [];
      this.orderService.getCustomersByName(filterText).subscribe(list => {
          this.Customers = list;
          this.LoadingCustomers = false;
      }, (error) => {

          if (error === 500) {
              this.globalMessages.ErrorMessages.push('Server connection error');
          }

          this.LoadingCustomers = false;
      });
  }

  getStatusName(status:number) {

    switch (status) {
      case 1:
        return 'Pending';

      case 2:
        return 'Payment Accepted';

      case 3:
        return 'Shipped';

      default:
        return 'Unknown';
    }

  }

}
