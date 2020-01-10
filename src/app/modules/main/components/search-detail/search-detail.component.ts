// ANGULAR
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// MODELS
import { IUserSearch } from '@models/search';

@Component({
    selector: 'app-search-detail',
    templateUrl: './search-detail.component.html',
    styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnChanges {

    @Input() user: IUserSearch;

    ngOnChanges(changes: SimpleChanges): void {
        this.user = changes.user.currentValue;
    }
}
