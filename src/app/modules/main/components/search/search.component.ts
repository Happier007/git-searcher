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
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck, takeUntil, tap } from 'rxjs/operators';

// MODELS
import { IUserSearch } from '@models/search';
import { IProfile } from '@models/profile';

// MAIN
import { GitService } from '@services/git.service';
import { IQueryParams } from '@models/queryParams';
import { MatTable } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import isEqual from 'lodash/isEqual';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    @ViewChild('usernameInput', {static: false}) usernameInput: ElementRef<HTMLInputElement>;
    @ViewChild('table', {static: false}) table: MatTable<Element>;
    private searchForm: FormGroup = this.buildForm();
    private destroy$: Subject<void> = new Subject<void>();
    public detailUser: IProfile;
    public checkedUsers: IProfile[] = [];
    public queryParams: IQueryParams;
    public countUsers: number;
    public displayedColumns: string[] = ['select', 'ava', 'login', 'score', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);
    public loading = false;

    public chips: IUserSearch[] = [];
    public usersChips$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private gitService: GitService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.queryParams = this.gitService.getRouteParams();
        // if (this.queryParams.q) {
        //     this.loadUsers(this.queryParams.q);
        //     this.searchForm.patchValue({username: this.queryParams.q});
        // }

        this.searchForm.get('username').valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged(isEqual),
                takeUntil(this.destroy$),
            ).subscribe((uname) => this.loadUsers(uname));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private buildForm(): FormGroup {
        return this.fb.group({
            username: new FormControl('', [
                Validators.required]),
        });
    }

    private submitForm(): void {
        if (this.searchForm.valid) {
            const searchName = this.searchForm.value.username;
            this.updateQueryParams(searchName, null, 0, 10);
            this.loadUsers(searchName);
            this.detailUser = null;
            this.checkedUsers = [];
        }
    }

    private updateQueryParams(q: string, id: number = null, pageIndex?: number, pageSize?: number): void {
        this.queryParams.q = q;
        this.queryParams.id = id;
        if (pageIndex >= 0) {
            this.queryParams.page = pageIndex;
        }
        if (pageSize > 0) {
            this.queryParams.pageSize = pageSize;
        }
        this.router.navigate([], {
            queryParams: {
                q: this.queryParams.q,
                id: this.queryParams.id,
                page: this.queryParams.page,
                per_page: this.queryParams.pageSize,
            }
        });
    }

    // private loadUsers(username: string): void {
    //     this.loading = true;
    //     this.users$ = this.gitService.searchUsers(username, this.queryParams.page, this.queryParams.pageSize)
    //         .pipe(
    //             tap((res: ISearch) => {
    //                 this.countUsers = res.total_count;
    //             }),
    //             pluck('items'),
    //             tap((users: IUserSearch[]) => {
    //                 if (this.queryParams.id) {
    //                     const user = users.find(item => item.id === this.queryParams.id);
    //                     this.selectUser(user.login, 'detail');
    //                 }
    //                 this.loading = false;
    //             })
    //         );
    // }


    private loadUsers(username: string): void {
        this.loading = true;
        this.usersChips$ = this.gitService.searchUsers(username, this.queryParams.page, this.queryParams.pageSize)
            .pipe(
                pluck('items'),
                tap(() => this.loading = false)
            );

    }


    public selectRow(row): void {
        this.selectUser(row.login, 'detail');
        this.updateQueryParams(this.queryParams.q, row.id);
    }

    public paginatorEvent(event: PageEvent): PageEvent {
        this.queryParams.pageSize = event.pageSize;
        if (this.queryParams.page !== event.pageIndex) {
            this.queryParams.page = event.pageIndex
            this.queryParams.id = null;
            this.detailUser = null;
        }
        if (this.queryParams.q) {
            this.updateQueryParams(this.queryParams.q, this.queryParams.id);
            this.loadUsers(this.queryParams.q);
        }
        return event;
    }

    public checkboxChange(event: MatCheckboxChange, row: IUserSearch): void {
        this.selection.toggle(row);
        if (event.checked) {
            this.selectUser(row.login);
        } else {
            this.removeUser(row.id);
        }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    private isAllSelected(users): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = users.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    private masterToggle(users): void {
        this.isAllSelected(users) ?
            this.clearTable(users) :
            this.fillTable(users);
    }

    private fillTable(users): void {
        this.checkedUsers = [];
        users.forEach(row => {
            this.selection.select(row);
            this.selectUser(row.login);
        });
    }

    private clearTable(users): void {
        this.selection.clear();
        users.forEach(row => {
            this.removeUser(row.id);
        });
    }

    private selectUser(login: string, typeUser: string = 'list'): void {
        this.gitService.userProfile(login)
            .pipe(
                takeUntil(this.destroy$)
            ).subscribe(
            (user: IProfile) => {
                if (typeUser === 'detail') {
                    this.detailUser = user;
                } else {
                    this.checkedUsers.push(user);
                }
            }
        );
    }

    private removeUser(id: number): void {
        this.checkedUsers = this.checkedUsers.filter(item => item.id !== id);
    }

    public removeChips(user: IUserSearch): void {
        const index = this.chips.indexOf(user);
        if (index >= 0) {
            this.chips.splice(index, 1);
            this.table.renderRows();
        }
    }

    public selectedChips(event: MatAutocompleteSelectedEvent): void {
        this.chips.push(event.option.value);
        this.countUsers = this.chips.length;
        this.usernameInput.nativeElement.value = '';
        this.table.renderRows();
    }
}
