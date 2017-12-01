import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'loading',
    providers: [],
    templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnChanges{
    @Input('loaded') loaded: boolean;
    remove: boolean;

    constructor(){}

    ngOnChanges(loaded) {
        if(this.loaded){            
            setTimeout(() => {  
                this.remove = true;
            }, 500);
        }else{
            this.remove = false;
        }
    }
}
