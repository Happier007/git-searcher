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
import { PaginationService } from '@services/pagination.service';
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
    private searchName: string;
    private destroy$: Subject<void> = new Subject<void>();
    public users: IUserSearch[];
    public selectedUser: IUserSearch;
    public detailUser: IProfile;
    public routeParams: IQueryParams;

    public countUsers: number;
    public displayedColumns: string[] = ['select', 'ava', 'login', 'score', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);

    constructor(private router: Router,
                private route: ActivatedRoute,
                private gitService: GitService,
                private fb: FormBuilder,
                private paginationService: PaginationService) {
        this.routeParams = this.paginationService.getRouteParams();
    }

    ngOnInit(): void {
        if (!!this.routeParams.q) {
            this.loadUsers();
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
            this.routeParams.q = this.searchForm.value.username;
            this.paginationService.setSearchParams(this.routeParams);
            this.selectedUser = null;
            this.checkedUsers = [];
        }
    }

    private loadUsers(): void {
        this.paginationService.setSearchParams(this.routeParams);
        this.paginationService.initUsersEvent$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.users = this.paginationService.users;
                this.countUsers = this.paginationService.countUsers;
                this.selectedUser = this.paginationService.selectedUser;
            });
    }

    public selectRow(row): void {
        this.addUser(row.login, 'detail');
        //this.updateQueryParams(this.searchName, row.id);
    }

    public paginatorEvent(event: PageEvent): void {
        this.paginationService.updateQueryParams(event);
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

    private addUser(login: string, typeUser: string = 'list'): void {
        this.gitService.profileUser(login)
            .pipe(
                takeUntil(this.destroy$)
            ).subscribe(
            (user: IProfile) => {
                if (typeUser === 'detail') {
                    this.detailUser = user;
                    this.routeParams.id = user.id;
                    this.paginationService.setSearchParams(this.routeParams);
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
