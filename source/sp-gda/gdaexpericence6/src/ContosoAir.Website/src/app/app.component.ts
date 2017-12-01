import { Component, HostBinding, OnInit } from '@angular/core';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { AdalService } from 'ng2-adal/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './shared/auth.service';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    providers: [NgbDatepickerConfig]
})
export class AppComponent implements OnInit {
    @HostBinding('class') public cssClass = 'route';
    UserAuthenticated: boolean;
    constructor(datepickerConfig: NgbDatepickerConfig, private router: Router, private adalService: AdalService, private authService: AuthService) {

        // customize default values of datepickers used by this component tree
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        datepickerConfig.minDate = {year: year, month: month, day: 1};
        datepickerConfig.maxDate = {year: 2099, month: 12, day: 31};

        // days that don't belong to current month are not visible
        datepickerConfig.outsideDays = 'hidden';

        // disable past days
        datepickerConfig.markDisabled = (date: NgbDateStruct) => {
            const d = new Date(date.year, date.month - 1, date.day);
            let current = new Date();
            return d.getDate() < current.getDate() && d.getMonth() === current.getMonth();
        };
    }

    ngOnInit() {
        //adal service
        if(this.adalService.userInfo.isAuthenticated){
            this.UserAuthenticated = true;
        }
        
        //scroll to top then route is changed
        this.router.events.subscribe((evt) => {
            let current_route = this.router.url.substr(1);
            if(current_route){
                this.cssClass = 'route-' + current_route;
            }
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            document.body.scrollTop = 0;
        });
    }
}
