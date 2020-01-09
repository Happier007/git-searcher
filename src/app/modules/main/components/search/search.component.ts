// ANGULAR
import { Component, OnInit, OnDestroy, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    private searchForm: FormGroup = this.buildForm();
    private searchName: string;
    private searchId: string;
    private destroy$: Subject<void> = new Subject<void>();
    public users$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();
    public selectedUser: IUserSearch;
    public countUsers: number;
    public pageIndex = 0;
    public pageSize = 10;
    public displayedColumns: string[] = ['select', 'ava', 'login', 'score', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);

    constructor(private router: Router,
                private route: ActivatedRoute,
                private gitService: GitService,
                private fb: FormBuilder) {
        this.searchName = this.route.snapshot.queryParamMap.get('q');
        this.searchId = this.route.snapshot.queryParamMap.get('id');
        this.pageSize = Number(this.route.snapshot.queryParamMap.get('per_page')) || this.pageSize;
        this.pageIndex = Number(this.route.snapshot.queryParamMap.get('page')) || this.pageIndex;
    }

    ngOnInit(): void {
        if (this.searchName) {
            this.loadUsers(this.searchName);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private buildForm(): FormGroup {
        return this.fb.group({
            username: new FormControl('', [
                Validators.required])
        });
    }

    private submitForm(): void {
        if (this.searchForm.valid) {
            this.searchName = this.searchForm.value.username;
            this.updateQueryParams(this.searchName, null, 0, 10);
            this.loadUsers(this.searchName);
            this.selectedUser = null;
            this.checkedUsers = [];
        }
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
        if (event) {
            this.selection.toggle(row);
        }
        if (event.checked) {
            this.addUser(row.login);
        } else {
            this.removeUser(row.id);
        }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(users) {
        const numSelected = this.selection.selected.length;
        const numRows = users.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(users) {
        this.isAllSelected(users) ?
            this.clearTable(users) :
            users.forEach(row => {
                this.selection.select(row);
                this.addUser(row.login);
            });
    }

    clearTable(users) {
        this.selection.clear();
        users.forEach(row => {
            this.removeUser(row.id);
        });
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
