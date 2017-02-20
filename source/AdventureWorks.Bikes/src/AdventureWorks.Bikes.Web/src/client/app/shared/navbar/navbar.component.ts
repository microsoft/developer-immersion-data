import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import {CartService} from '../order/cart.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'top-subnavbar',
  templateUrl: 'navbar.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class NavbarComponent {

   constructor(public router: Router, public cart:CartService) {}

   isActiveRoute(route: string) {
        return this.router.serializeUrl(this.router.urlTree) === this.router.serializeUrl((this.router.createUrlTree([route])));
   }

}
