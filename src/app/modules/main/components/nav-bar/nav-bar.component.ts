// ANGULAR
import { Component, OnInit, OnDestroy } from '@angular/core';

// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// MODELS
import { IUser } from '@models/user';

// MAIN
import { GitService } from '@services/git.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject<void>();
    public user: IUser;

    constructor(private gitService: GitService) {
    }

    ngOnInit(): void {
        this.user = this.gitService.readUser();
        this.gitService.getAuthUser()
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(
                (data: IUser) => this.user = data
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public logout() {
        this.gitService.logout();
    }
}
