import { Component } from '@angular/core';

@Component({
    templateUrl: '../shared/home.component.html'
})
export class CityComponent {
    CityPage: boolean;
    CurrentCity: string;
    SearchReady: boolean;
    DealsReady: boolean;

    constructor(){
        this.CityPage = true;
        this.CurrentCity = 'BCN';
        this.SearchReady = false;
        this.DealsReady = false;
    }

    onSearchReady(status: boolean) {
        this.SearchReady = status;
    }

    onDealsReady(status: boolean) {
        this.DealsReady = status;
    }
}
