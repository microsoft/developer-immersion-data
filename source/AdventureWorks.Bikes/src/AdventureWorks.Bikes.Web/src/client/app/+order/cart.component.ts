import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {CartService} from '../shared/order/cart.service';
import {ProductService} from '../shared/product/product.service';
import {Product} from '../shared/product/product.entity';
import {OrderItem} from '../shared/order/order-item.entity';


@Component({
  moduleId: module.id,
  selector: 'aw-cart',
  templateUrl: 'cart.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [ProductService]
})
export class CartComponent {

  constructor(public Cart:CartService, public productService:ProductService) {}

  SubtractItem(orderItem:OrderItem) {

    if(orderItem.Quantity > 1 || (orderItem.Quantity===1 && confirm('are you sure?'))) {
        this.Cart.remove(orderItem.Product);
    }

  }

  SumItem(orderItem:OrderItem) {
      this.Cart.add(orderItem.Product);
  }

  GetProductImage(item:Product) {
    return this.productService.getImageUrl(item.productId);
  }

}
