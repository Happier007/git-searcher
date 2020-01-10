// ANGULAR
import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IProfile } from '@models/profile';

@Component({
    selector: 'app-search-checked',
    templateUrl: './search-checked.component.html',
    styleUrls: ['./search-checked.component.scss']
})
export class SearchCheckedComponent implements OnChanges {

    @Input() checkedUsers: IProfile[] = [];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.checkedUsers = changes.checkedUsers.currentValue;
    }

    public trackByFn(index: number): number {
        return index;
    }
}
