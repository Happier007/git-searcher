// ANGULAR
import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'app-search-checked',
    templateUrl: './search-checked.component.html',
    styleUrls: ['./search-checked.component.scss']
})
export class SearchCheckedComponent implements OnInit, OnChanges {

    @Input() checkedUsers: [];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.checkedUsers = changes.checkedUsers.currentValue;
    }

    ngOnInit(): void {
    }
}
