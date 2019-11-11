import { Component, OnInit } from '@angular/core';
import { GitService } from '../../services/git.service';
import { IUser } from '@models/user';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

    public user: IUser;

    constructor(private gitService: GitService) {
    }

    ngOnInit() {
        this.user = this.gitService.readUser();
        this.gitService.getAuthUser().subscribe(
            (data: IUser) => this.user = data
        );
    }

    public logout() {
        this.gitService.logout();
    }
}
