import { Component } from '@angular/core';
import { AdalService } from 'ng2-adal/core';
import { BookingService } from './booking.service';

@Component({
    selector: 'navbar',
    providers: [],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    name: string;

    constructor(private adalService: AdalService, private bookingService: BookingService) {
        
        this.adalService.getUser().subscribe(
            res => {
                this.name = res.profile.name.split(' ')[0];
                this.bookingService.setUser(res);
            },
            err => {
                console.log(err);
            }
        );
    }

    logout() {
        this.adalService.logOut();
    }

    login() {
        this.adalService.login();
    }

}
