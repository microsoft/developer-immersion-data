import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes, Router } from '@angular/router';
import { HTTP_PROVIDERS} from '@angular/http';
import { HomeComponent } from './+home/home.component';
import { StoresComponent } from './+store/stores.component';
import { StoreDetailComponent } from './+store/detail.component';
import { SearchProductComponent } from './+search/product.component';
import { ProductDetailComponent } from './+product/detail.component';
import { BackofficeStoreComponent } from './+backoffice/store.component';
import { CartComponent } from './+order/cart.component';
import { NavbarComponent, MessageComponent, ModalConfig, LoginComponent, CartModalComponent, SecurityService} from './shared/index';



/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  viewProviders: [HTTP_PROVIDERS],
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, MessageComponent, LoginComponent, CartModalComponent]
})
@Routes([
  {
    path: '/',
    component: HomeComponent
  },
  {
    path: '/cart',
    component: CartComponent
  },
  {
    path: '/stores/:id',
    component: StoreDetailComponent
  },
  {
    path: '/stores',
    component: StoresComponent
  },
  {
    path: '/search/:term',
    component: SearchProductComponent
  },
  {
    path: '/products/:id',
    component: ProductDetailComponent
  },
  {
    path: '/backoffice',
    component: BackofficeStoreComponent
  }
])
export class AppComponent {

  constructor(public ModalConfig:ModalConfig, public Security:SecurityService, public router: Router) {}

  isActiveRoute(route: string) {
        return this.router.serializeUrl(this.router.urlTree) === this.router.serializeUrl((this.router.createUrlTree([route])));
  }

}
