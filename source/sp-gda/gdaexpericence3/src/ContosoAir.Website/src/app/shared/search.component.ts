import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AirportsService } from './airports.service';
import { BookingService } from './booking.service';
import { Airport } from './airport';
import { consoleTestResultHandler } from "tslint/lib/test";

@Component({
    selector: 'search',
    providers: [AirportsService],
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
    airports: (Airport)[];
    @Input('city') city: string;//
    @Output() onSearchReady = new EventEmitter<boolean>();

    @ViewChild('fromDestination') fromDestination: ElementRef;
    @ViewChild('toDestination') toDestination: ElementRef;
    @ViewChild('fromDate') fromtDate: ElementRef;
    @ViewChild('toDate') toDate: ElementRef;

    booking: any;
    hasFocus: boolean;
    startDate: { year: number, month: number, day: number };
    endDate: { year: number, month: number, day: number };
    searchData: any;

    constructor(private airportsService: AirportsService, private parentRouter: Router, private bookingService: BookingService) {
        this.booking = this.bookingService.get();
    }

    ngOnInit() {
        //if(this.city === 'BCN'){
        //    const date = new Date();
        //    let startDate = this.moveDate(date, 15);
        //    let endDate =  this.moveDate(date, 30);
        //    // this.startDate= { year: startDate.getFullYear(), month: startDate.getMonth() + 1, day: startDate.getDate() };
        //     this.endDate= { year: endDate.getFullYear(), month: endDate.getMonth() + 1, day: endDate.getDate() };
        //}
        this.airportsService.get().subscribe(
            res => {
                //this.airports
                let airports = res.sort(function (a, b) {
                    if (a && b && a.city && b.city && typeof a.city === 'string' && typeof b.city === 'string') {
                        let nameA = a.city.toUpperCase();
                        let nameB = b.city.toUpperCase();
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                    }
                    return 0;
                });

                let selectFrom = document.getElementById('fromDestination');
                let selectTo = document.getElementById('toDestination');

                //add API options
                for (let airport of airports) {
                    if (airport.code && airport.city) {
                        let optionFrom = document.createElement('option');
                        let optionTo = document.createElement('option');
                        optionFrom.value = optionTo.value = airport.code;
                        optionFrom.innerHTML = optionTo.innerHTML = airport.city + ' ' + airport.code;
                        if (this.city && this.city === airport.code) {
                            optionTo.selected = true;
                        }
                        if (optionFrom.value === 'BCN') {
                            optionFrom.selected = true;
                        }
                        if (optionTo.value === 'SEA') {
                            optionTo.selected = true;
                        }
                        //if(this.city === 'BCN' && airport.code === 'SEA'){
                        //  optionFrom.selected = true;
                        //}
                        selectFrom.appendChild(optionFrom);
                        selectTo.appendChild(optionTo);
                    }
                }
                this.onSearchReady.emit(true);
            },
            err => {
                console.log(err);
            }
        );
    }

    focus() {
        this.hasFocus = true;
    }

    setBooking() {

        this.searchData = {
            fromCode: this.fromDestination.nativeElement.value,
            toCode: this.toDestination.nativeElement.value,
            fromDate: this.fromtDate.nativeElement.value,
            endDate: this.toDate.nativeElement.value,
            fromCity: this.fromDestination.nativeElement.value,
            toCity: this.toDestination.nativeElement.value
        }

        this.booking.fromDate = this.fromtDate.nativeElement.value;
        this.booking.endDate = this.toDate.nativeElement.value;
        this.booking.fromCode = this.fromDestination.nativeElement.value;
        this.booking.toCode = this.toDestination.nativeElement.value,
            // this.booking.username =  this.bookingService.getUser();

            this.bookingService.set(this.booking);

        this.bookingService.searchDetails = this.searchData;

        this.parentRouter.navigateByUrl('/flights');
    }

    private moveDate(date: Date, days: number): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    }

    private convertDate(year: number, month: number, day: number): Date {
        return new Date(year, month - 1, day);
    }
}
