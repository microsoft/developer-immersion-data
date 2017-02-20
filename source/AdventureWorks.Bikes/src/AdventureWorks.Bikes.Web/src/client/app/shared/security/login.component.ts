import { Component } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { SecurityService } from './security.service';
import { StoreService } from '../store/store.service';
import { Router } from '@angular/router';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'aw-login-modal',
  templateUrl: 'login.component.html',
  providers: [StoreService]
})
export class LoginComponent {

  Checking=false;

  Username:String;
  Password:String;

  Error=false;

  constructor(public ModalConfig:ModalConfig,
              public securityService:SecurityService,
              public router:Router,
              public storeService:StoreService) {}

  remainOpen(event:Event) {
    event.stopPropagation();
  }

  doLogin() {
    this.Checking = true;
    this.Error = false;

    this.securityService.getTokenRequest(this.Username, this.Password)
        .subscribe(json => {
          this.securityService.Token = json.access_token;
          this.securityService.getUser().subscribe(user => {

            this.securityService.User = user;
            this.Checking = false;
            this.router.navigate(['/backoffice']);
            this.ModalConfig.closeLogin();

          });

        }, (err) => {

          this.Checking = false;
          if(err.status===500) {
            this.ModalConfig.closeLogin();
          } else {
            this.Error = true;
          }

        });
  }

}
