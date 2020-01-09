// ANGULAR
import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'app-search-checked',
    templateUrl: './search-checked.component.html',
    styleUrls: ['./search-checked.component.scss']
})
export class SearchCheckedComponent implements OnChanges {

    @Input() checkedUsers: any[];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.checkedUsers = changes.checkedUsers.currentValue;
    }

    public trackByFn(_: number, item: any): number {
        return item.id;
    }
}
