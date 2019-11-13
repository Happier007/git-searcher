// ANGULAR
import { Component, OnInit } from '@angular/core';

// RXJS
import { Observable } from 'rxjs';

// MODELS
import { IProfile } from '@models/profile';
import { IUser } from '@models/user';

// MAIN
import { GitService } from '@services/git.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public profile$: Observable<IProfile>;
    public user: IUser;

    constructor(private gitService: GitService) {
    }

    ngOnInit() {
        this.user = this.gitService.readUser();
        if (this.user) {
            this.profile$ = this.gitService.getProfile(this.user.token);
        }
    }
}
