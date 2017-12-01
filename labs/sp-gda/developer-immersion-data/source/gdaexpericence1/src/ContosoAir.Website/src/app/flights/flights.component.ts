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
    time_required: any;
    realTIme: any;
    preferredRegion: any;
    time_status: boolean;

    flightsdata: (Flight)[];
    flightsthere: (Flight)[];
    flightsback: (Flight)[];

    constructor(private flightsService: FlightsService, private parentRouter: Router, private bookingService: BookingService) {
        this.searchDetails = this.bookingService.searchDetails;
        this.booking = this.bookingService.get();
    }

    ngOnInit() {
        this.time_status = false;
        this.searchDetails = this.bookingService.searchDetails;
        this.booking = this.bookingService.get();
        if (typeof this.booking !== 'undefined') {
            setTimeout(() => {
                this.flightsService.get().subscribe(
                    res => {
                        //  Set region name which is set as preferred region in api
                        var data_length = res.length;
                        this.preferredRegion = res[data_length - 1]
                        var preferedREgion = this.preferredRegion.split(":", 2);
                        this.preferredRegion = preferedREgion[1];
                        //  Set data retrival time
                        this.time_required = res[data_length - 2];
                        var realTime = this.time_required.split(":", 2);
                        this.realTIme = realTime[1];
                        this.time_status = true;
                        //  Arrange retrived json data
                        this.flights = res;
                      
                        this.flightsthere = res.filter(data => data.fromCode === this.booking.fromCode && data.toCode === this.booking.toCode);
                        this.flightsback = res.filter(data => data.fromCode === this.booking.toCode && data.toCode === this.booking.fromCode);
                        let daysDiff = (new Date(this.booking.endDate).getDay()) - (new Date(this.booking.fromDate).getDay());
                        
                        this.flights_there = res.filter(data => data.fromCode === this.booking.fromCode && data.toCode === this.booking.toCode);
                       
                        this.flights_there = this.getFlightresult(this.flights_there, daysDiff);
                       
                        this.flight_there_id = this.flights_there[0].id;
                        this.flights_back = res.filter(data => data.fromCode === this.booking.toCode && data.toCode === this.booking.fromCode);
                      
                        this.flights_back = this.getFlightresult(this.flights_back, daysDiff);
                        
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

    close() {
        this.time_status = false;
    }

    checkDay(day) {
        if (day > 6) {
            return (day - 7);
        }
        else {
            return (day);
        }
    }

    // Filter records according to selected date
    getFlightresult(result, no_of_days) {
        switch (no_of_days) {            
            case 0:
                this.flightsdata = result.filter(data => (new Date(data.fldate).getDay()) === (new Date(this.booking.fromDate).getDay()));
                break;
            case 1:
                this.flightsdata = result.filter(data => (new Date(data.fldate).getDay()) === (new Date(this.booking.fromDate).getDay()) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 1)));
                break;
            case 2:
                this.flightsdata = result.filter(data => (new Date(data.fldate).getDay()) === (new Date(this.booking.fromDate).getDay()) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 1)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 2)));
                break;
            case 3:
                this.flightsdata = result.filter(data => (new Date(data.fldate).getDay()) === (new Date(this.booking.fromDate).getDay()) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 1)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 2)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 3)));
                break;
            case 4:
                this.flightsdata = result.filter(data => (new Date(data.fldate).getDay()) === (new Date(this.booking.fromDate).getDay()) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 1)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 2)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 3)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 4)));
                break;
            case 5:
                this.flightsdata = result.filter(data => (new Date(data.fldate).getDay()) === (new Date(this.booking.fromDate).getDay()) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 1)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 2)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 3)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 3)) || (new Date(data.fldate).getDay()) === this.checkDay((new Date(this.booking.fromDate).getDay() + 5)));
                break;
            default:                
                this.flightsdata = result;
                break;
        }
        return this.flightsdata;
    }

    setBooking() {
        this.parentRouter.navigateByUrl('/seats');
    }
}
