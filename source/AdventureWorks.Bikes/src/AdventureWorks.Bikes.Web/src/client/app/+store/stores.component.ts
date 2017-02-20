
import { Component, OnInit } from '@angular/core';
import { Store } from '../shared/store/store.entity';
import { ProductCardComponent } from '../+product/card.component';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ProductService } from '../shared/product/product.service';
import { StoreService } from '../shared/store/store.service';
import { MessageService } from '../shared/message/message.service';

@Component({
  moduleId: module.id,
  selector: 'aw-stores',
  templateUrl: 'stores.component.html',
  providers: [ProductService, StoreService],
  directives: [ProductCardComponent, ROUTER_DIRECTIVES]
})
export class StoresComponent implements OnInit {

    PlaceName:String;

    LocationAvailable = true;

    LoadingLatests = false;
    LoadingNearest = false;

    Latests:Store[] =[];
    Nearest:Store[] =[];

    Error:String;

    constructor(private productService:ProductService,
                private storeService:StoreService,
                private globalMessages:MessageService) {

           this.PlaceName = '';

    }

    ngOnInit() {

      this.globalMessages.removeMessages();
      this.LoadNearStores();
      this.LoadLatests();

    }

    LoadNearStores() {

              this.PlaceName = this.storeService.CityName;

              this.storeService
                  .getNearBy(3)
                  .subscribe(stores =>  {

                        this.Nearest = stores;
                        this.Nearest.forEach(store => this.LoadProductsFromStore(store));
                        this.LoadingNearest = false;
                     },
                     () => {
                       this.globalMessages.addError('Server connection error');
                       this.LoadingNearest = false;
                     },
                     () => this.LoadingNearest = false );


    }

    LoadLatests() {

      this.LoadingLatests = true;
      this.storeService
          .getAll(6)
          .subscribe(stores =>  this.Latests = stores,
                     () => {
                       this.globalMessages.addError('Server connection error');
                       this.LoadingLatests = false;
                     },
                     () => this.LoadingLatests = false );
    }

    Meters2Miles(meters:number):number {
      return meters*0.000621371192;
    }

    LoadProductsFromStore(store:Store) {

      this.productService
          .getFromStore(store.storeId, 3)
          .subscribe(products =>  store.products = products,
                     () => this.globalMessages.addError('Server connection error'));

    }



}
