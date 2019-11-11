import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

// RXJS
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';

// MAIN
import { IUserSearch } from '@models/search';
import { GitService } from '../../services/git.service';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges {

    private searchForm: FormGroup;
    public users$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();
    public searchName: string;
    public searchId: string;
    public selectedUser: IUserSearch;
    public checkedUsers: IUserSearch[];

    public displayedColumns: string[] = ['select', 'ava', 'login', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);

    constructor(private gitService: GitService, private router: Router, private route: ActivatedRoute) {
        this.searchName = this.route.snapshot.queryParamMap.get('q');
        this.searchId = this.route.snapshot.queryParamMap.get('id');
    }

    ngOnInit() {
        this.initForm();
        if (this.searchName) {
            this.downloadUsers(this.searchName);
        }
    }

    ngOnChanges(changes: SimpleChanges) {

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
        this.router.navigate([], {queryParams: {q: form.username, id: null}});
        this.downloadUsers(form.username);
    }

    private downloadUsers(username: string): void {
        this.users$ = this.gitService.searchUsers(username)
            .pipe(
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
        this.router.navigate(['/search'], {queryParams: {q: this.searchName, id: row.id}});
    }

    onChange(event: MatCheckboxChange, row: IUserSearch) {
        if (event.checked) {
            this.checkedUsers.push(row);
        }
    }
}
