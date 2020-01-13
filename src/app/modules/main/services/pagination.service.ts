import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { IQueryParams } from '@models/queryParams';
import { pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GitService } from '@services/git.service';
import { ISearch, IUserSearch } from '@models/search';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {

    private usersSubject$ = new Subject<any>();
    private queryParams: IQueryParams = {};
    public countUsers: number;
    public selectedUser: IUserSearch;
    public users: IUserSearch[] = [];
    public initUsersEvent$: EventEmitter<any> = new EventEmitter<any>();
    private destroy$: Subject<void> = new Subject<void>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private gitService: GitService) {
        this.initUsersSubject();
    }

    public setSearchParams(routeParams: IQueryParams): void {
        this.queryParams = routeParams;
        this.usersSubject$.next();
    }

    public updateQueryParams(event: PageEvent): void {
        this.queryParams.page = event.pageIndex;
        this.queryParams.per_page = event.pageSize;
        this.usersSubject$.next();
    }

    public getRouteParams(): IQueryParams {
        const searchName = this.route.snapshot.queryParamMap.get('q');
        const searchId = +this.route.snapshot.queryParamMap.get('id') || null;
        const pageSize = +this.route.snapshot.queryParamMap.get('per_page') || 0;
        const pageIndex = +this.route.snapshot.queryParamMap.get('page') - 1 || 10;
        const routeParams = {
            q: searchName,
            id: searchId,
            page: pageIndex,
            per_page: pageSize
        };
        return routeParams;
    }

    private initUsersSubject() {
        this.usersSubject$
            .pipe(
                switchMap(() => this.gitService.searchUsers(this.queryParams)),
                tap((res: ISearch) => this.countUsers = res.total_count),
                pluck('items'),
                tap((users: IUserSearch[]) => {
                    if (this.queryParams.id) {
                        this.selectedUser = users.find(item => item.id === this.queryParams.id);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe(
                (users: IUserSearch[]) => {
                    this.users = users;
                    this.initUsersEvent$.emit();

                    this.router.navigate([], {
                        queryParams: this.queryParams
                    });
                }
            );
    }
}
