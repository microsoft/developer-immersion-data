import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { enableProdMode, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS} from '@angular/http';
import { CartService } from './shared/order/cart.service';
import { StoreService } from './shared/store/store.service';
import { APIConfig } from './shared/api.config';
import { MessageService } from './shared/message/message.service';
import { AppComponent } from './app.component';
import { ModalConfig} from './shared/modal.config';
import { SecurityService } from './shared/security/security.service';



if ('<%= ENV %>' === 'prod') { enableProdMode(); }

/**
 * Bootstraps the application and makes the ROUTER_PROVIDERS and the APP_BASE_HREF available to it.
 * @see https://angular.io/docs/ts/latest/api/platform-browser-dynamic/index/bootstrap-function.html
 */
bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  CartService,
  APIConfig,
  StoreService,
  MessageService,
  ModalConfig,
  SecurityService,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  provide(APP_BASE_HREF, { useValue: '<%= APP_BASE %>' })
]);

// In order to start the Service Worker located at "./worker.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
//
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./worker.js').then((registration: any) =>
//       console.log('ServiceWorker registration successful with scope: ', registration.scope))
//     .catch((err: any) =>
//       console.log('ServiceWorker registration failed: ', err));
// }
