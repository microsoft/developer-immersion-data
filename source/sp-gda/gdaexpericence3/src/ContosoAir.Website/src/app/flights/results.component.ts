import { Component, ViewChild, Input, OnInit, OnChanges } from '@angular/core';
import { BookingService } from '../shared/booking.service';
import { FlightsService } from '../flights/flights.service';
import { Flight } from './flight';

@Component({
    selector: 'results',
    templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, OnChanges {
    @Input('flights') flights: (Flight)[];
    @Input('direction') direction: string;
    tempdata: any;
    selected: string;
    booking: any;
    LoaderVisibility: boolean;

    // -------------
    constructor(
        private bookingService: BookingService,
        private flightsService: FlightsService
    ) {
    }
  
    ngOnInit() {
        this.booking = this.bookingService.get();
    }

    ngOnChanges(flights) {
        if (this.flights) {
            this.selected = this.flights[0].id;
            let flight = this.flights.filter(data => data.id === this.selected)[0];
            this.set(flight);
        }
    }

    set(flight: Flight): void {
        this.selected = flight.id;
        this.booking[this.direction] = flight;
    }
}
