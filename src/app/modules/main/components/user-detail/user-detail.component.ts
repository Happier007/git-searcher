import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserSearch } from '@models/search';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

    @Input() user: IUserSearch;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => console.log(params.id));
    }
}
