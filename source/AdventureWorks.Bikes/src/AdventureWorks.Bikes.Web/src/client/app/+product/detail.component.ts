import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/product/product.entity';
import { Store } from '../shared/store/store.entity';
import { ProductService } from '../shared/product/product.service';
import { StoreService } from '../shared/store/store.service';
import { CartService } from '../shared/order/cart.service';
import { CartModalComponent } from '../shared/order/cart-modal.component';
import { MessageService } from '../shared/message/message.service';
import { ProductCardComponent } from './card.component';
import { StoreHeaderComponent } from '../+store/header.component';
import { ROUTER_DIRECTIVES, RouteSegment  } from '@angular/router';
import {TruncatePipe} from '../shared/pipes/truncate';
import { ModalConfig } from '../shared/modal.config';


@Component({
  moduleId: module.id,
  selector: 'aw-product-detail',
  templateUrl: 'detail.component.html',
  pipes: [TruncatePipe],
  providers: [ProductService],
  directives: [ProductCardComponent, StoreHeaderComponent, CartModalComponent, ROUTER_DIRECTIVES]
})
export class ProductDetailComponent implements OnInit {

  Product:Product=null;

  Store:Store=null;

  Section:String;

  Related:Product[] =[];

  ImageUrl:String;

  IsRefreshing:Boolean=false;

  constructor(
      public ModalConfig:ModalConfig,
      private productService:ProductService,
      private storeService:StoreService,
      private cartService:CartService,
      private routeParams:RouteSegment,
      private globalMessages:MessageService) {

    this.Section = 'details';
  }

  ngOnInit() {

    this.globalMessages.removeMessages();

    let id = parseInt(this.routeParams.getParam('id'));
    this.ImageUrl = this.productService.getImageUrl(id);

    this.productService.get(id)
        .subscribe(product => {

            this.Product = product;
            this.storeService.get(this.Product.storeId).subscribe(
              store => this.Store = store
            );

            this.LoadRelated();
        },
        () => {
          this.globalMessages.ErrorMessages.push('Server connection error');
        });


  }

  LoadRelated() {

      this.IsRefreshing = false;

      this.productService
          .getRelated(this.Product.name)
          .subscribe(ids =>  {

            ids.forEach(id => {

                this.productService.get(id).subscribe(product => {
                    this.Related.push(product);
                    this.IsRefreshing = false;
                },() => {
                    this.globalMessages.addError('Server connection error');
                    this.IsRefreshing = false;
                });

            });

          },
          () => {
            this.globalMessages.addError('Server connection error');
            this.IsRefreshing = false;
          });

  }

  AddToCart() {
    this.cartService.add(this.Product);
    this.ModalConfig.openCartNotice();
  }

}
