
import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/product/product.entity';
import { ProductCardComponent } from '../+product/card.component';
import { ROUTER_DIRECTIVES, RouteSegment } from '@angular/router';
import { ProductService } from '../shared/product/product.service';
import { MessageService } from '../shared/message/message.service';

@Component({
  moduleId: module.id,
  selector: 'aw-search-product',
  templateUrl: 'product.component.html',
  providers: [ProductService],
  directives: [ProductCardComponent, ROUTER_DIRECTIVES]
})
export class SearchProductComponent implements OnInit {

   Term:String;

   TotalResults:Number;

   Items:Product[] =[];

   IsRefreshing:Boolean=false;

   constructor(private routeParams:RouteSegment,
               private productService:ProductService,
               private globalMessages:MessageService) {

     this.Term = routeParams.getParam('term');

   }

   ngOnInit() {
     this.globalMessages.removeMessages();
     this.LoadMore();
   }

   LoadMore() {

     this.IsRefreshing = true;

      this.productService
          .search(this.Term)
          .subscribe(products =>  {
            this.Items = products;
            this.TotalResults = this.Items.length;
            this.IsRefreshing = false;
          },
          (err) => {

            if(err===500) {
                this.globalMessages.addError('Server connection error');
            }
            this.TotalResults = 0;
            this.IsRefreshing = false;
          });

     this.IsRefreshing = false;

   }

}
