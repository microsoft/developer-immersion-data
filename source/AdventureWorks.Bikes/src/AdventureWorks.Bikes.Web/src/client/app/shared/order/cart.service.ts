import {Product} from '../product/product.entity';
import {Order} from './order.entity';
import {OrderItem} from './order-item.entity';
import { Injectable } from '@angular/core';

@Injectable()
export class CartService {

    Count:number=0;
    Total:number=0;

    private Order:Order;

    constructor() {
        this.Order = new Order();
    }


    total() {
        return this.Order.Total;
    }

    getItems() {
        return this.Order.Items;
    }

    add(Item:Product) {

        let inCart = false;
        this.Order.Items.forEach(orderItem => {
            if(orderItem.Product.productId === Item.productId) {
                inCart=true;
                orderItem.Quantity++;
                orderItem.Total = orderItem.Product.finalPrice * orderItem.Quantity;
            }
        });

        if(!inCart) {

            let orderItem = new OrderItem();
            orderItem.Product  = Item;
            orderItem.Quantity = 1;
            orderItem.Total    = Item.finalPrice;

            this.Order.Items.push(
                orderItem
            );
        }

        this.recalculate();

    }

    remove(Item:Product) {

        let orderItemSelected:OrderItem = null;
        this.Order.Items.forEach(orderItem => {
            if(orderItem.Product.productId === Item.productId) {
                orderItemSelected = orderItem;
            }
        });

        if(orderItemSelected) {

            if(orderItemSelected.Quantity>1) {
                orderItemSelected.Quantity--;
                orderItemSelected.Total = orderItemSelected.Product.finalPrice * orderItemSelected.Quantity;
            }else {
                var index = this.Order.Items.indexOf(orderItemSelected, 0);
                if (index > -1) {
                    this.Order.Items.splice(index, 1);
                }
            }

        }

        this.recalculate();

    }


    recalculate() {

        this.Order.Total = 0;
        this.Count = 0;
        this.Order.Items.forEach(orderItem => {
            this.Order.Total += orderItem.Total;
            this.Count+=orderItem.Quantity;
        });
        this.Total = this.Order.Total;

    }

}
