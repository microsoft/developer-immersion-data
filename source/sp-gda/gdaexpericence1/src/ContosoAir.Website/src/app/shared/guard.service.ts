import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AdalService } from 'ng2-adal/core';

@Injectable()
export class GuardService implements CanActivate {
    constructor(private adalService: AdalService, private router: Router) {
    }

    canActivate() {
        if (this.adalService.userInfo.isAuthenticated) {
            return true;
        } else {
            this.adalService.login();
            return false;
        }
    }
}