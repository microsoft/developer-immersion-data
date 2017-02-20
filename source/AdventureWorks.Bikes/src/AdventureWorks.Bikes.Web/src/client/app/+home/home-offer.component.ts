
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../shared/product/product.entity';
import { ProductService } from '../shared/product/product.service';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'aw-home-offer',
  templateUrl: 'home-offer.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class HomeOfferComponent implements OnInit {

   @Input() Bike:Product=null;
   @Input() PictureAtRight:Boolean=false;

   ImageUrl:String;

   constructor(private productService: ProductService) { }

   ngOnInit() {
      if(this.Bike)
          this.ImageUrl = this.productService.getImageUrl(this.Bike.productId);
   }

}
