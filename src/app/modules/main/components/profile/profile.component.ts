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

    private user: IUser;
    public profile$: Observable<IProfile>;

    constructor(private gitService: GitService) {
    }

    ngOnInit(): void {
        this.user = this.gitService.readUser();
        if (this.user) {
            this.profile$ = this.gitService.getProfile(this.user.token);
        }
    }
}
