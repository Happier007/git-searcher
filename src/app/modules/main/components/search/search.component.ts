// ANGULAR
import { Component, OnInit, OnDestroy, Output, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// MATERIAL
import { MatCheckboxChange } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';

// CDK
import { SelectionModel } from '@angular/cdk/collections';

// RXJS
import { forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, map, mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';

// MODELS
import { ISearch, IUserSearch } from '@models/search';
import { IProfile } from '@models/profile';

// MAIN
import { GitService } from '@services/git.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    @Output() checkedUsers: any = [];
    @ViewChild('usernameInput', {static: false}) usernameInput: ElementRef<HTMLInputElement>;
    private searchForm: FormGroup;
    private searchName: string;
    private searchId: string;
    private destroy$: Subject<void> = new Subject<void>();
    public users$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();
    public selectedUser: IUserSearch;
    public countUsers: number;
    public pageIndex = 0;
    public pageSize = 10;
    public displayedColumns: string[] = ['select', 'ava', 'login', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);

    constructor(private router: Router,
                private route: ActivatedRoute,
                private gitService: GitService) {
        this.searchName = this.route.snapshot.queryParamMap.get('q');
        this.searchId = this.route.snapshot.queryParamMap.get('id');
        this.pageSize = Number(this.route.snapshot.queryParamMap.get('per_page')) || this.pageSize;
        this.pageIndex = Number(this.route.snapshot.queryParamMap.get('page')) || this.pageIndex;
    }

    ngOnInit(): void {
        this.initForm();
        if (this.searchName) {
            this.loadUsers(this.searchName);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm(): void {
        this.searchForm = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.pattern(/^[A-z0-9]*$/),
                Validators.minLength(3)]),
        });
    }

    private submitForm(form): void {
        this.searchName = form.username;
        this.updateQueryParams(this.searchName, null, 0, 10);
        this.loadUsers(this.searchName);
    }

    private updateQueryParams(q: string, id: number = null, pageIndex?: number, pageSize?: number) {
        this.pageIndex = pageIndex || this.pageIndex;
        this.pageSize = pageSize || this.pageSize;
        this.router.navigate([], {
            queryParams: {
                q,
                id,
                page: this.pageIndex,
                per_page: this.pageSize
            }
        });
    }

    private loadUsers(username: string): void {
        this.users$ = this.gitService.searchUsers(username, this.pageIndex, this.pageSize)
            .pipe(
                tap((res: ISearch) => {
                    this.countUsers = res.total_count;
                }),
                pluck('items'),
                tap((users: any) => {
                    if (this.searchId) {
                        this.selectedUser = users.find(item => item.id.toString() === this.searchId);
                    }
                })
            );
    }

    public selectRow(row): void {
        this.selectedUser = row;
        this.updateQueryParams(this.searchName, row.id);
    }

    public paginatorEvent(event: PageEvent): PageEvent {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        if (this.searchName) {
            this.updateQueryParams(this.searchName);
            this.loadUsers(this.searchName);
        }
        return event;
    }

    public onChange(event: MatCheckboxChange, row: IUserSearch): void {
        if (event.checked) {
            this.addUser(row.login);
        } else {
            this.removeUser(row.id);
        }
    }

    private addUser(login: string): void {
        this.gitService.searchUser(login)
            .pipe(
                mergeMap((user: IProfile) => {
                        return forkJoin(
                            this.gitService.getRepos(user.repos_url),
                            this.gitService.getGists(user.url))
                            .pipe(
                                map((responses: any) => {
                                    return {
                                        profile: user,
                                        repos: responses[0],
                                        gists: responses[1]
                                    };
                                })
                            );
                    }
                ),
                takeUntil(this.destroy$)
            ).subscribe(
            (data) => this.checkedUsers.push(data)
        );
    }

    private removeUser(id: number): void {
        this.checkedUsers = this.checkedUsers.filter(item => item.profile.id !== id);
    }
}
