import { Component, ViewChild, Input, OnInit, OnChanges } from '@angular/core';
import { BookingService } from '../shared/booking.service';
import { FlightsService } from '../flights/flights.service';
import { Flight } from './flight';
import { Popup } from 'ng2-opd-popup';
import { FlightsFeedbackService } from './flightsFeedback.service';

@Component({
    selector: 'results',
    templateUrl: './results.component.html',
    providers: [FlightsFeedbackService],
})
export class ResultsComponent implements OnInit, OnChanges {
    @Input('flights') flights: (Flight)[];
    @Input('direction') direction: string;
    tempdata: any;
    selected: string;
    booking: any;
    LoaderVisibility: boolean;

    // For Doughnut chart
    public doughnutChartLabels: string[] = ['Good', 'Average', 'Poor'];
    public doughnutChartData: number[] = [0, 0, 0];
    public doughnutChartType: string = 'doughnut';
    public doughnutChartOptions: any = {
        legend: { position: 'left' }
    }

    // Doughnut chart events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    constructor(
        private bookingService: BookingService,
        private flightsService: FlightsService,
        private flightsFeedbackService: FlightsFeedbackService
    ) {
        this.LoaderVisibility = false;
    }

    // Popup for display flight feedbacks in chart format
    @ViewChild('popup1') popup1: Popup;

    // Display flight feedbacks in Popup on flight click
    ClickButton(segment) {
        debugger;
        if (this.LoaderVisibility == true) {
            this.LoaderVisibility = false;
        }
        this.popup1.options = {
            header: "Flight Feedback",
            color: "#28aae1", // red, blue.... 
            widthProsentage: 40, // The with of the popou measured by browser width 
            animationDuration: 1, // in seconds, 0 = no animation 
            showButtons: true, // You can hide this in case you want to use custom buttons 
            confirmBtnContent: "OK", // The text on your confirm button 
            cancleBtnContent: "Cancel", // the text on your cancel button 
            confirmBtnClass: "btn btn-md btn-primary", // your class for styling the confirm button 
            cancleBtnClass: "btn btn-md btn-primary", // you class for styling the cancel button 
            animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
        };
        this.popup1.show(this.popup1.options);

        this.doughnutChartData = [0, 0, 0];
        setTimeout(() => {
            this.flightsFeedbackService.get(segment.flight).subscribe(
                res => {
                    this.doughnutChartData = [res['Good_Feedbacks'], res['Average_Feedbacks'], res['Poor_Feedbacks']]
                    this.LoaderVisibility = true;
                },
                err => {
                    this.doughnutChartData = [0, 0, 0]
                    this.LoaderVisibility = true;
                }
            );
        }, 2500);
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
