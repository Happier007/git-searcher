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
import { pluck, takeUntil, tap } from 'rxjs/operators';

// MODELS
import { ISearch, IUserSearch } from '@models/search';
import { IProfile } from '@models/profile';

// MAIN
import { GitService } from '@services/git.service';
import { IQueryParams } from '@models/queryParams';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    @Output() checkedUsers: IProfile[] = [];
    @ViewChild('usernameInput', {static: false}) usernameInput: ElementRef<HTMLInputElement>;
    private searchForm: FormGroup = this.buildForm();
    private destroy$: Subject<void> = new Subject<void>();
    public users$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();
    public selectedUser: IProfile;
    public queryParams: IQueryParams;
    public countUsers: number;
    public displayedColumns: string[] = ['select', 'ava', 'login', 'score', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);

    constructor(private router: Router,
                private route: ActivatedRoute,
                private gitService: GitService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.queryParams = this.gitService.getRouteParams();
        if (this.queryParams.q) {
            this.loadUsers(this.queryParams.q);
        }
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
            this.updateQueryParams(searchName);
            this.loadUsers(searchName);
            this.selectedUser = null;
            this.checkedUsers = [];
        }
    }

    private updateQueryParams(q: string, id: number = null, pageIndex: number = 0, pageSize: number = 10) {
        this.queryParams.q = q;
        this.queryParams.id = id;
        this.queryParams.page = pageIndex || this.queryParams.page;
        this.queryParams.pageSize = pageSize || this.queryParams.pageSize;
        this.router.navigate([], {
            queryParams: {
                q: this.queryParams.q,
                id: this.queryParams.id,
                page: this.queryParams.page,
                per_page: this.queryParams.page,
            }
        });
    }

    private loadUsers(username: string): void {
        this.users$ = this.gitService.searchUsers(username, this.queryParams.page, this.queryParams.pageSize)
            .pipe(
                tap((res: ISearch) => {
                    this.countUsers = res.total_count;
                }),
                pluck('items'),
                tap((users: IUserSearch[]) => {
                    if (this.queryParams.id) {
                        const user = users.find(item => item.id === this.queryParams.id);
                        this.addUser(user.login, 'detail');
                    }
                })
            );
    }

    public selectRow(row): void {
        this.addUser(row.login, 'detail');
        this.updateQueryParams(this.queryParams.q, row.id);
    }

    public paginatorEvent(event: PageEvent): PageEvent {
        this.queryParams.pageSize = event.pageSize;
        this.queryParams.page = event.pageIndex;
        if (this.queryParams.q) {
            this.updateQueryParams(this.queryParams.q);
            this.loadUsers(this.queryParams.q);
        }
        return event;
    }

    public checkboxChange(event: MatCheckboxChange, row: IUserSearch): void {
        this.selection.toggle(row);
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

    private addUser(login: string, typeUser: string = 'list'): void {
        this.gitService.searchUser(login)
            .pipe(
                takeUntil(this.destroy$)
            ).subscribe(
            (user: IProfile) => {
                if (typeUser === 'detail') {
                    this.selectedUser = user;
                } else {
                    this.checkedUsers.push(user);
                }
            }
        );
    }

    private removeUser(id: number): void {
        this.checkedUsers = this.checkedUsers.filter(item => item.id !== id);
    }
}
