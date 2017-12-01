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
    NotificationReady: boolean;
    PurchaseReady: boolean;
    SoloService: boolean;

    constructor(private bookingService: BookingService, private adalService: AdalService) {
        this.BookingReady = true;
        this.PurchaseReady = false;
        // Added for Service status
        this.SoloService = false;
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
        //  this.booking.there.segments[0].seat = this.booking.seat;
        this.price = parseInt(this.booking.there.price, 10) + parseInt(this.booking.back.price, 10);
    }

    complete() {
        this.BookingReady = false;
        this.NotificationReady = false;
        this.booking.username = this.name;
        this.BookingReady = true;
        this.PurchaseReady = true;
    }

    // Change Solo Service status on checkbox click
    ApplySoloService() {
        if (this.SoloService == true) {
            this.SoloService = false;
        }
        else {
            this.SoloService = true;
        }
    }
}
