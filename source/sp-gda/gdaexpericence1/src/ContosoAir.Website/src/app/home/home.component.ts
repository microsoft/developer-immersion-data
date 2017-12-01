import { Component } from '@angular/core';

@Component({
    templateUrl: '../shared/home.component.html'
})
export class HomeComponent{
    CurrentCity: string;
    SearchReady: boolean;
    DealsReady: boolean;

    constructor(){
        this.CurrentCity = ' ';
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
