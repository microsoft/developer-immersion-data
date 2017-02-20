import { Component, Input, OnInit } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Product } from '../product/product.entity';
import { ProductService } from '../product/product.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'aw-cart-modal',
  templateUrl: 'cart-modal.component.html',
  providers: [ProductService],
  directives: [ROUTER_DIRECTIVES]
})
export class CartModalComponent implements OnInit {

  @Input() Product:Product=null;

  Image:String;

  constructor(public ModalConfig:ModalConfig, public service:ProductService) {}

  ngOnInit() {

    this.Image = this.service.getImageUrl(this.Product.productId);

  }

}
