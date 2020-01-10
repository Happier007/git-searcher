import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GitService } from '@services/git.service';
import { IProfile } from '@models/profile';
import { IRepos } from '@models/repos';
import { IGist } from '@models/gist';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnChanges, OnDestroy {

    @Input() user: IProfile;
    private destroy$: Subject<void> = new Subject<void>();
    public repos$: Observable<IRepos[]>;
    public gists$: Observable<IGist[]>;

    constructor(private gitService: GitService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.user = changes.user.currentValue;
        this.fetchRepos(this.user);
        this.fetchGists(this.user);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public fetchRepos(user: IProfile): void {
        this.repos$ = this.gitService.getRepos(user.repos_url)
            .pipe(
                takeUntil(this.destroy$)
            );
    }

    public fetchGists(user: IProfile): void {
        this.gists$ = this.gitService.getGists(user.url)
            .pipe(
                takeUntil(this.destroy$)
            );
    }

    public trackByFn(index: number): number {
        return index;
    }
}
