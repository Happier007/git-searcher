// ANGULAR
import { Component, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// MATERIAL
import { MatCheckboxChange } from '@angular/material';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

// CDK
import { SelectionModel } from '@angular/cdk/collections';

// RXJS
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';

// MAIN
import { ISearch, IUserSearch } from '@models/search';
import { GitService } from '@services/git.service';
import { IProfile } from '@models/profile';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    @Output() checkedUsers = [];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    private searchForm: FormGroup;
    private searchName: string;
    private searchId: string;
    private destroy$: Subject<void> = new Subject<void>();
    public users$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();
    public selectedUser: IUserSearch;
    public countUsers: number;
    public pageIndex = 1;
    public pageSize = 10;
    public displayedColumns: string[] = ['select', 'ava', 'login', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);

    constructor(private gitService: GitService, private router: Router, private route: ActivatedRoute) {
        this.searchName = this.route.snapshot.queryParamMap.get('q');
        this.searchId = this.route.snapshot.queryParamMap.get('id');
        this.pageSize = Number(this.route.snapshot.queryParamMap.get('per_page')) || this.pageSize;
        this.pageIndex = Number(this.route.snapshot.queryParamMap.get('page')) || this.pageIndex;
    }

    ngOnInit(): void {
        this.initForm();
        if (this.searchName) {
            this.downloadUsers(this.searchName);
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
                        this.selectedUser = users.find(item => item.id.toString() === this.searchId);
                    }
                })
            );
    }

    private navigate(q: string, id: number) {
        this.router.navigate([], {
            queryParams: {
                q,
                id,
                page: this.pageIndex,
                per_page: this.pageSize
            }
        });
    }

    public onChange(event: MatCheckboxChange, row: IUserSearch): void {
        if (event.checked) {
            this.gitService.searchUser(row.login)
                .pipe(
                    mergeMap((user: IProfile) => {
                            return forkJoin(this.gitService.getInfo(row.repos_url),
                                this.gitService.getInfo(row.url + '/gists'))
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
        } else {
            const delIndex = this.checkedUsers.findIndex(item => item.profile.id === row.id);
            if (delIndex >= 0) {
                this.checkedUsers.splice(delIndex, 1);
            }
        }
    }

    public checkboxLabel(row?: IUserSearch): string {
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
    }

    public selectRow(row): void {
        this.selectedUser = row;
        this.navigate(this.searchName, row.id);
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
}


// forkJoin(this.gitService.getRepos(row.repos_url), this.gitService.getGists(row.url + '/gists'))
//     .pipe(
//         takeUntil(this.destroy$)
//     )
//     .subscribe(
//         (data) => {
//             this.checkedUsers.push({
//                 info: row,
//                 repos: data[0],
//                 gists: data[1],
//             });
//         }
//     );
