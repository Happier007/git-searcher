// ANGULAR
import { Component, Input, OnInit } from '@angular/core';

// RXJS
import { Observable } from 'rxjs';

// MODELS
import { IUserSearch } from '@models/search';

// MAIN
import { GitService } from '@services/git.service';


@Component({
    selector: 'app-search-detail',
    templateUrl: './search-detail.component.html',
    styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {

    @Input() user: IUserSearch;
    public repos: Observable<any>;
    public gists: Observable<any>;

    constructor(private gitService: GitService) {
    }

    ngOnInit() {
        this.repos = this.gitService.getRepos(this.user.repos_url);
        this.gists = this.gitService.getGists(this.user.url);
    }
}
