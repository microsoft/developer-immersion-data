import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CityVideosService } from './city-video.service';
import { Video } from './video';

@Component({
    providers: [ CityVideosService ],
    templateUrl: '../shared/home.component.html'
})
export class CityVideoComponent {
    CityPage: boolean;
    VideoPage: boolean;
    CurrentCity: string;
    SearchReady: boolean;
    DealsReady: boolean;
    private base: string = 'https://aka.ms/ampembed?url=';
    video: Video;
    url: SafeStyle;

    constructor(private cityVideosService: CityVideosService,
                private sanitizer: DomSanitizer){
        this.CityPage = true;
        this.VideoPage = true;
        this.CurrentCity = 'BCN';
        this.SearchReady = false;
    }

    ngOnInit() {
        this.cityVideosService.get().subscribe(
            res => {
                this.video = res;
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.base + this.video.links.barcelona + this.video.formats.desktop + '?autoplay=true');
            },
            err => {
                console.log(err);
            }
        );
    }

    onSearchReady(status: boolean) {
        this.SearchReady = status;
    }

    onDealsReady(status: boolean) {
        this.DealsReady = status;
    }
}
