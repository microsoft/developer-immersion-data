import { Component, OnInit } from '@angular/core';
import { FlightsService } from './flights.service';
import { Router } from '@angular/router';
import { BookingService } from '../shared/booking.service';
import { Flight } from './flight';

@Component({
    providers: [FlightsService],
    templateUrl: './flights.component.html'
})
export class FlightsComponent implements OnInit {
    flights: (Flight)[];
    flights_there: (Flight)[];
    flights_back: (Flight)[];
    booking: any;
    searchDetails: any;
    FlightsReady: boolean;
    flight_there_id: string;
    flight_back_id: string;

    constructor(private flightsService: FlightsService, private parentRouter: Router, private bookingService: BookingService) {
        this.searchDetails = this.bookingService.searchDetails;
        this.booking = this.bookingService.get();
    }

    ngOnInit() {
        this.searchDetails = this.bookingService.searchDetails;
        this.booking = this.bookingService.get();
        if (typeof this.booking !== 'undefined') {
            setTimeout(() => {
                this.flightsService.get().subscribe(
                    res => {
                        this.flights = res;                     
                        this.flights_there = res.filter(data => data.fromCode === this.booking.fromCode && data.toCode === this.booking.toCode && parseInt(data.fldate.split("-")[2]) >= parseInt(this.booking.fromDate.split("-")[2]) && parseInt(data.fldate.split("-")[2]) <= parseInt(this.booking.endDate.split("-")[2]));
                        this.flight_there_id = this.flights_there[0].id;                        
                        this.flights_back = res.filter(data => data.fromCode === this.booking.toCode && data.toCode === this.booking.fromCode && parseInt(data.fldate.split("-")[2]) >= parseInt(this.booking.fromDate.split("-")[2]) && parseInt(data.fldate.split("-")[2]) <= parseInt(this.booking.endDate.split("-")[2]));
                        this.flight_back_id = this.flights_back[0].id;                        
                        this.FlightsReady = true;
                    },
                    err => {
                        console.log(err);
                    }
                );
            }, 2500);
        }
    }

    setBooking() {
        this.parentRouter.navigateByUrl('/seats');
    }
}
