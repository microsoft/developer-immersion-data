import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { DealsService } from './deals.service';
import { Deal } from './deal';

@Component({
    selector: 'deals',
    providers: [DealsService],
    templateUrl: './deals.component.html'
})
export class DealsComponent implements OnInit {
    deals: (Deal)[];
    date: Date;
    @Output() onDealsReady = new EventEmitter<boolean>();

    constructor(private dealsService: DealsService) { }

    ngOnInit() {
        //default date. today + 15days
        let date = new Date();
        this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15);
        setTimeout(() => {
            this.dealsService.get().subscribe(
                res => {
                    this.deals = res.filter(data => data.since !== null);
                    this.onDealsReady.emit(true);
                },
                err => {
                    console.log(err);
                }
            );
        }, 2500);
    }
}
