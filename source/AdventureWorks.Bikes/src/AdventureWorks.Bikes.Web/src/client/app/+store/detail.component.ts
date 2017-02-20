
import { Component, OnInit } from '@angular/core';
import { Store } from '../shared/store/store.entity';
import { Product } from '../shared/product/product.entity';
import { ProductCardComponent } from '../+product/card.component';
import { StoreHeaderComponent } from './header.component';
import { ROUTER_DIRECTIVES, RouteSegment } from '@angular/router';
import { ProductService } from '../shared/product/product.service';
import { StoreService } from '../shared/store/store.service';
import { MessageService } from '../shared/message/message.service';

@Component({
  moduleId: module.id,
  selector: 'aw-store-detail',
  templateUrl: 'detail.component.html',
  providers: [ProductService, StoreService],
  directives: [ProductCardComponent, StoreHeaderComponent, ROUTER_DIRECTIVES]
})
export class StoreDetailComponent implements OnInit {

   Store:Store;
   BackgroundImageUrl:String;
   Section:String;

   Featured:Product[] =[];
   Trending:Product[] =[];
   Arrivals:Product[] =[];

   IsRefreshing:Boolean=false;

   constructor(private productService:ProductService,
       private storeService:StoreService,
       private routeParams:RouteSegment,
       private globalMessages:MessageService) {



   }

    ngOnInit() {

        this.globalMessages.removeMessages();


        let id = parseInt(this.routeParams.getParam('id'));
        this.BackgroundImageUrl = this.storeService.getImageUrl(id);
        this.storeService.get(id)
            .subscribe(store => {
                this.Store = store;
                this.Load('featured');
            },
            () => {
              this.globalMessages.ErrorMessages.push('Server connection error');
            });
    }

   Load(section:String, page:Number = 1) {

     this.IsRefreshing = true;
     this.Section = section;

     switch(this.Section) {

         case 'featured':

            if(page===1) this.Featured = [];

            this.productService
                .getFromStore(this.Store.storeId, 12)
                .subscribe(products =>  {
                  this.Featured = products;
                  this.IsRefreshing = false;
                },
                () => {
                  this.globalMessages.addError('Server connection error');
                  this.IsRefreshing = false;
                });
         break;

         case 'arrivals':

            if(page===1) this.Arrivals = [];

            this.productService
                .getFromStore(this.Store.storeId, 12)
                .subscribe(products =>  {
                  this.Arrivals = products;
                  this.IsRefreshing = false;
                },
                () => {
                  this.globalMessages.addError('Server connection error');
                  this.IsRefreshing = false;
                });
         break;

         case 'trends':

            if(page===1) this.Trending = [];

            this.productService
                .getFromStore(this.Store.storeId, 12)
                .subscribe(products =>  {
                  this.Trending = products;
                  this.IsRefreshing = false;
                },
                () => {
                  this.globalMessages.addError('Server connection error');
                  this.IsRefreshing = false;
                });
         break;

     }

   }

}
