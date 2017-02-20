
import { Component, OnInit } from '@angular/core';
import {HomeOfferComponent} from './home-offer.component';
import { Store } from '../shared/store/store.entity';
import { Product } from '../shared/product/product.entity';
import { ProductService } from '../shared/product/product.service';
import { StoreService } from '../shared/store/store.service';
import { MessageService } from '../shared/message/message.service';
import { ProductCardComponent } from '../+product/card.component';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'aw-home',
  templateUrl: 'home.component.html',
  providers: [ProductService, StoreService],
  directives: [HomeOfferComponent, ProductCardComponent, ROUTER_DIRECTIVES]
})
export class HomeComponent implements OnInit {

   Stores:Store[]    =[];

   Offers:Product[]  =[];

   Bikes:Product[]   =[];

   SearchTerm:String;

   LoadingStores = false;
   LoadingOffers = false;
   LoadingBikes  = false;

   constructor(private router: Router,
     private productService: ProductService,
     private storeService: StoreService,
     private globalMessages:MessageService) {

     this.SearchTerm = '';

   }

   ngOnInit() {
     this.globalMessages.removeMessages();
     this.LoadStores();
     this.LoadOffers();
     this.LoadBikes();
   }

   LoadBikes() {
      this.LoadingBikes = true;
      this.productService
          .getAll(9)
          .subscribe(products =>  this.Bikes = products,
                     () => {
                       this.globalMessages.addError('Server connection error');
                       this.LoadingBikes = false;
                      },
                     () => this.LoadingBikes = false );
   }

   LoadOffers() {
      this.LoadingOffers = true;
      this.productService
          .getHighlighted()
          .subscribe(products =>  this.Offers = products,
                     () => {
                       this.globalMessages.addError('Server connection error');
                       this.LoadingOffers = false;
                      },
                     () => this.LoadingOffers = false );
   }

   LoadStores() {

      this.LoadingStores = true;
      this.storeService
          .getAll()
          .subscribe(stores =>  this.Stores = stores,
                     () => {
                       this.globalMessages.addError('Server connection error');
                       this.LoadingStores = false;
                      },
                     () => this.LoadingStores = false );
   }

   SearchKeyPress(key:Number) {
     //if key pressed is the 'enter' key
     if(key===13 && this.SearchTerm.length > 0) {
       this.router.navigate( ['/search', this.SearchTerm] );
     }
   }

}
