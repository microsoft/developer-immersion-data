
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../shared/store/store.entity';
import { StoreService } from '../shared/store/store.service';

@Component({
    moduleId: module.id,
    selector: 'aw-store-header',
    templateUrl: 'header.component.html',
    providers: [StoreService]
})
export class StoreHeaderComponent implements OnInit {

    @Input() Store: Store;
    BackgroundImageUrl: String[] = [];

    IsRefreshing: Boolean = false;

    constructor(private storeService: StoreService) { }

    ngOnInit() {
        if (this.Store.storeId) {
            this.BackgroundImageUrl.push(this.storeService.getImageUrl(this.Store.storeId, 1));
            this.BackgroundImageUrl.push(this.storeService.getImageUrl(this.Store.storeId, 2));
            this.BackgroundImageUrl.push(this.storeService.getImageUrl(this.Store.storeId, 3));
        }
    }

}
