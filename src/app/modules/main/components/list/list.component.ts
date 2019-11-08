import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GitService } from '../../services/git.service';
import { ISearch, IUserSearch } from '@models/search';
import { Observable } from 'rxjs';
import { IProfile } from '@models/profile';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    // public users$: Observable<ISearch> = new Observable<ISearch>();
    public users: IUserSearch[];
    public profile$: Observable<IProfile> = new Observable<IProfile>();
    public selectedUsername: string;
    public selectedId: string;

    constructor(private gitService: GitService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(
            data => {
                console.log(data);
                this.selectedUsername = data.q;
                this.selectedId = data.id;
                if (data.q) {
                    this.gitService.searchUsers(data.q).subscribe(
                        (resUsers: ISearch) => {
                            this.users = resUsers.items;
                        }
                    );
                }
                if (data.id) {
                    // this.profile$ = this.gitService.searchUsers(data.q);
                }
            }
        );
    }
}
