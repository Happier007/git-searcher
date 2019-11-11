import { Component, Input, OnInit } from '@angular/core';
import { IUserSearch } from '@models/search';
import { GitService } from '../../services/git.service';
import { Observable } from "rxjs";

@Component({
    selector: 'app-search-detail',
    templateUrl: './search-detail.component.html',
    styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {

    @Input() user: IUserSearch;
    public info: any;
    public repos: any;
    public gists: any;

    constructor(private gitService: GitService) {
    }

    ngOnInit() {
        this.gitService.getRepos(this.user.repos_url).subscribe(
            (data) => {
                this.repos = JSON.stringify(data, null, 2);
            }
        );
        this.gitService.getGists(this.user.url + '/gists').subscribe(
            (data) => {
                this.gists = JSON.stringify(data, null, 2);
            }
        );
    }
}
