import { Component, OnInit, SimpleChanges, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

// RXJS
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';

// MAIN
import { ISearch, IUserSearch } from '@models/search';
import { GitService } from '@services/git.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @Output() checkedUsers: IUserSearch[] = [];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    private searchForm: FormGroup;
    public users$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();
    public searchName: string;
    public searchId: string;
    public selectedUser: IUserSearch;
    public countUsers: number;
    public pageIndex = 1;
    public pageSize = 10;

    public displayedColumns: string[] = ['select', 'ava', 'login', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);
    public dataSource = new MatTableDataSource<IUserSearch>();
    pageEvent: PageEvent;

    constructor(private gitService: GitService, private router: Router, private route: ActivatedRoute) {
        this.dataSource.paginator = this.paginator;
        this.searchName = this.route.snapshot.queryParamMap.get('q');
        this.searchId = this.route.snapshot.queryParamMap.get('id');
        this.pageSize = Number(this.route.snapshot.queryParamMap.get('per_page')) || this.pageSize;
        this.pageIndex = Number(this.route.snapshot.queryParamMap.get('page')) || this.pageIndex;
    }

    ngOnInit() {
        this.initForm();
        if (this.searchName) {
            this.downloadUsers(this.searchName);
        }
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
        this.navigate(form.username, null);
        this.searchName = form.username;
        this.downloadUsers(form.username);
    }

    private downloadUsers(username: string): void {
        this.users$ = this.gitService.searchUsers(username, this.pageIndex.toString(), this.pageSize.toString())
            .pipe(
                tap((res: ISearch) => {
                    this.countUsers = res.total_count;
                }),
                pluck('items'),
                tap((users: IUserSearch[]) => {
                    if (this.searchId) {
                        this.selectedUser = this.gitService.findUser(users, this.searchId);
                    }
                })
            );
    }

    public checkboxLabel(row?: IUserSearch): string {
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
    }

    public selectRow(row): void {
        this.selectedUser = row;
        this.navigate(this.searchName, row.id);
    }

    public onChange(event: MatCheckboxChange, row: IUserSearch) {
        if (event.checked) {
            this.checkedUsers.push(row);
            this.checkedUsers = this.checkedUsers.slice();
        } else {
            this.checkedUsers = this.checkedUsers.filter(item => item !== row);
        }
    }

    public getPaginatorData(event: PageEvent): PageEvent {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        if (this.searchName) {
            this.navigate(this.searchName, null);
            this.downloadUsers(this.searchName);
        }
        return event;
    }

    public navigate(q: string, id: number) {
        this.router.navigate([], {
            queryParams: {
                q,
                id,
                page: this.pageIndex,
                per_page: this.pageSize
            }
        });
    }
}
