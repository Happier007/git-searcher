// ANGULAR
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

// RXJS
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// MATERIAL
import { PageEvent } from '@angular/material/paginator';

// MODELS
import { IProfile } from '@models/profile';
import { IRepos } from '@models/repos';
import { IGist } from '@models/gist';

// SERVICES
import { GitService } from '@services/git.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnChanges, OnDestroy {

    @Input() user: IProfile;
    public repos$: Observable<IRepos[]>;
    public gists$: Observable<IGist[]>;
    public pageIndexRepos: number;
    public pageIndexGists: number;
    private destroy$: Subject<void> = new Subject<void>();

    constructor(private gitService: GitService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.user = changes.user.currentValue;
        this.pageIndexRepos = 0;
        this.pageIndexGists = 0;
        this.fetchRepos(this.user);
        this.fetchGists(this.user);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public fetchRepos(user: IProfile, page: number = 0): void {
        this.repos$ = this.gitService.getRepos(user.repos_url, page)
            .pipe(
                takeUntil(this.destroy$)
            );
    }

    public fetchGists(user: IProfile, page: number = 0): void {
        this.gists$ = this.gitService.getGists(user.url, page)
            .pipe(
                takeUntil(this.destroy$)
            );
    }

    public pageEventRepos(event: PageEvent): void {
        this.pageIndexRepos = event.pageIndex;
        this.fetchRepos(this.user, this.pageIndexRepos);

    }

    public pageEventGists(event: PageEvent): void {
        this.pageIndexGists = event.pageIndex;
        this.fetchGists(this.user, this.pageIndexGists);
    }

    public trackByFn(index: number): number {
        return index;
    }
}
