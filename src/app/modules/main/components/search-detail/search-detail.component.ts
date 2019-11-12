import { Component, Input, OnInit } from '@angular/core';
import { IUserSearch } from '@models/search';
import { GitService } from '@services/git.service';
import { Observable } from 'rxjs';

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
        this.gists = this.gitService.getGists(this.user.url + '/gists');
    }
}
