
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../shared/product/product.entity';
import { ProductService } from '../shared/product/product.service';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'product-card',
  templateUrl: 'card.component.html',
  directives: [ ROUTER_DIRECTIVES]
})
export class ProductCardComponent implements OnInit {

   @Input() Product:Product=null;

   ImageUrl:String;

   constructor(private productService: ProductService) {  }

   ngOnInit() {
      if(this.Product)
          this.ImageUrl = this.productService.getImageUrl(this.Product.productId);
   }

}
