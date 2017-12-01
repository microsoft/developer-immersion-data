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

    days: { date: Date, price: number, day: number }[];
    flight1: (Flight)[];
    maxinde: number;
    minprice: number;
    tempdate: string;
    temparr: any;
    loopvar: number = 0;

    constructor() {
        this.days = [];
    }

    ngOnInit() {
    }

    ngOnChanges(flights) {
        if (typeof this.flights_days !== 'undefined') {
            this.date = this.date + 'T00:00:00Z';

            let newDate = new Date(this.date);
            for (let i = 0; i < 8; i++) {
                this.days[i] = {
                    date: newDate,
                    price: 0,
                    day: 0
                };
                this.days[i].date = this.moveDate(newDate, i - 3);
                this.days[i].day = parseInt(("" + this.days[i].date).split(" ")[2]);
            }

            this.maxinde = this.indexOfMax(this.days);
            let max = this.maxinde + 1;
            this.flight1 = this.flights_days.filter(data => data.fromCode === this.fromCode && data.toCode === this.toCode && parseInt(data.fldate.split('T')[0].split("-")[2]) >= parseInt(("" + this.days[0].date).split(" ")[2]) && parseInt(data.fldate.split('T')[0].split("-")[2]) <= parseInt(("" + this.days[this.maxinde].date).split(" ")[2]));
            if (max != this.days.length) {
                let flight2 = this.flights_days.filter(data => data.fromCode === this.toCode && data.toCode === this.fromCode && parseInt(data.fldate.split('T')[0].split("-")[2]) >= parseInt(("" + this.days[this.maxinde + 1].date).split(" ")[2]) && parseInt(data.fldate.split('T')[0].split("-")[2]) <= parseInt(("" + this.days[this.days.length - 1].date).split(" ")[2]));
                this.flight1 = this.flight1.concat(flight2);
            }

            this.loopvar = 0;
            for (var i = 0; i < this.days.length; i++) {
                this.temparr = this.flight1.filter(data => parseInt(data.fldate.split('T')[0].split("-")[2]) === parseInt(("" + this.days[i].date).split(" ")[2]));
                if (this.temparr.length > 0) {
                    this.minprice = this.temparr[0].price;
                    this.tempdate = this.temparr[0].fldate;
                    for (var j = 0; j < this.temparr.length; j++) {
                        if (this.tempdate === this.temparr[j].fldate) {
                            if (this.temparr[j].price <= this.minprice) {
                                this.days[this.loopvar].price = this.temparr[j].price;
                                this.minprice = this.temparr[j].price;
                                this.tempdate = this.temparr[j].fldate;
                            }
                        }
                    }
                }
                this.loopvar += 1;
            }
        }
    }


    private indexOfMax(arr) {
        if (arr.length === 0) {
            return -1;
        }

        var max = arr[0].day;
        var maxIndex = 0;
        for (var i = 1; i < arr.length; i++) {

            if (arr[i].day > max) {
                maxIndex = i;
                max = arr[i].day;
            }
        }

        return maxIndex;
    }

    private moveDate(date: Date, days: number): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    }
}
