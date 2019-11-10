import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GitService } from '../../services/git.service';
import { ISearch, IUserSearch } from '@models/search';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    public users$: Observable<IUserSearch[]> = new Observable<IUserSearch[]>();
    public selectedName: string;
    public displayedColumns: string[] = ['select', 'ava', 'login', 'url'];
    public selection = new SelectionModel<IUserSearch>(true, []);

    constructor(private gitService: GitService, private route: ActivatedRoute, private router: Router) {
        this.selectedName = this.route.snapshot.queryParamMap.get('q');
    }

    ngOnInit() {
        if (this.selectedName) {
            this.users$ = this.gitService.searchUsers(this.selectedName)
                .pipe(
                    map((dataUsers: ISearch) => {
                        return dataUsers.items;
                    })
                );
        }
    }
    checkboxLabel(row?: IUserSearch): string {
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
    }

    public selectRow(row): void {
        this.router.navigate(['/search'], {queryParams: {q: this.selectedName, id: row.id}});
    }
}
