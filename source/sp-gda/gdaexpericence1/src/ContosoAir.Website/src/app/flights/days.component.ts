import { Component, Input, OnInit } from '@angular/core';
import { Flight } from './flight';

@Component({
    selector: 'days',
    templateUrl: './days.component.html'
})
export class DaysComponent implements OnInit {
    @Input('date') date: string;
    @Input('fromCode') fromCode: any;
    @Input('toCode') toCode: any;
    @Input() flights_days: (Flight)[];

    days: { date: Date, price: number, day: number, days: number }[];
    minprice: number;
    tempdate: string;
    tempdata: any;
    loopvar: number = 0;

    constructor() {
        this.days = [];
    }

    ngOnInit() {
    }

    ngOnChanges(flights) {
        if (typeof this.flights_days !== 'undefined') {
            this.date = this.date + 'T00:00:00Z';

            // Create's an array of date's according to selected date 
            let newDate = new Date(this.date);
            for (let i = 0; i < 8; i++) {
                this.days[i] = {
                    date: newDate,
                    price: 0,
                    day: 0,
                    days: 0
                };
                this.days[i].date = this.moveDate(newDate, i - 3);
                this.days[i].day = parseInt(("" + this.days[i].date).split(" ")[2]);
                this.days[i].days = (new Date(this.days[i].date).getDay());
            }

            // get minimum price according to day
            this.loopvar = 1;
            for (var i = 0; i < this.days.length; i++) {
                this.tempdata = this.flights_days.filter(data => (new Date(data.fldate).getDay()) === parseInt(("" + this.days[i].days)));
                if (this.tempdata.length > 0) {
                    this.minprice = this.tempdata[0].price;
                    for (var j = 0; j < this.tempdata.length; j++) {
                        if (parseInt(this.tempdata[j].price) <= parseInt("" + this.minprice)) {
                            this.days[i].price = this.tempdata[j].price;
                            this.minprice = this.tempdata[j].price;
                            this.tempdate = this.tempdata[j].fldate;
                        }
                    }
                    this.loopvar += 1;
                }
            }
        }
    }

    private moveDate(date: Date, days: number): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    }
}