import { Component, OnInit } from '@angular/core';
import { BookingService } from '../shared/booking.service';
import { AdalService } from 'ng2-adal/core';

@Component({
    templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {
    booking: any;
    name: string;
    price: number;
    letters: string[];
    BookingReady: boolean;
    PurchaseReady: boolean;

    constructor(private bookingService: BookingService, private adalService: AdalService) {
        this.BookingReady = true;
        this.PurchaseReady = false;
        this.adalService.getUser().subscribe(
            res => {
                this.name = res.profile.name;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit() {
        this.letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        this.booking = this.bookingService.get();

        //asign random seats to flights
        for (let i = 0; i < this.booking.there.segments.length; i++) {
            this.booking.there.segments[i].seat = this.booking.seat;
        }
        for (let i = 0; i < this.booking.back.segments.length; i++) {
            this.booking.back.segments[i].seat = this.booking.seat;
        }
        // asign selected seat
        this.price = parseInt(this.booking.there.price, 10) + parseInt(this.booking.back.price, 10);
    }

    complete() {
        this.BookingReady = false;
        this.booking.username = this.name;
        this.bookingService.push().subscribe(
            res => {
                this.BookingReady = true;
                this.PurchaseReady = true;
            },
            err => {
                console.log(err);
            }
        );

    }
}