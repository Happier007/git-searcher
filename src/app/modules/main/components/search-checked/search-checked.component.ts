import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { IUserSearch } from '@models/search';
import {GitService} from '@services/git.service';

@Component({
    selector: 'app-search-checked',
    templateUrl: './search-checked.component.html',
    styleUrls: ['./search-checked.component.scss']
})
export class SearchCheckedComponent implements OnInit, OnChanges {

    @Input() checkedUsers: IUserSearch[];

    constructor(private gitService: GitService) {
    }

    ngOnChanges(changes: SimpleChanges) {
      this.checkedUsers = changes.checkedUsers.currentValue;
      this.gitService.getCheckedUsers(this.checkedUsers);
    }

    ngOnInit() {
    }
}
