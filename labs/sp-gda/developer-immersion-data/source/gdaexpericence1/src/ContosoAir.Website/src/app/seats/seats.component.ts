import { Component, OnInit } from '@angular/core';
import { SeatsService } from './seats.service';
import { Router } from '@angular/router';
import { BookingService } from '../shared/booking.service';

@Component({
    providers: [SeatsService],
    templateUrl: './seats.component.html'
})
export class SeatsComponent implements OnInit {
    booking: any;
    flight: any;
    rows: any;
    selected: { row: number, column: number };
    SeatsReady: boolean;

    constructor(private seatsService: SeatsService, private bookingService: BookingService) {
    }

    ngOnInit() {
        this.booking = this.bookingService.get();
        this.flight = this.booking.there.segments[0];
        setTimeout(() => {
            this.seatsService.get().subscribe(
                res => {
                    this.rows = res.rows;
                    this.SeatsReady = true;

                    //set preffered seat like selected
                    for (let i = 0; i < this.rows.length; i++) {
                        let j = this.rows[i].indexOf(2);
                        if (j > -1) {
                            this.set(2, i, j);
                        }
                    }
                },
                err => {
                    console.log(err);
                }
            );
        }, 2500);
    }

    // Arrange seat data
    set(status: number, row: number, column: number): void {
        if (status === 0 || status === 2) {
            let letters = ['A', 'B', 'C', 'D', 'E', 'F'];
            this.booking.seat = (row + 17) + letters[column];
            this.rows[row][column] = 4;
            if (status === 0) {
                this.rows[this.selected.row][this.selected.column] = 0;
            }
            this.selected = { row: row, column: column };
        }
    }

}
