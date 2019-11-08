import { Component, OnInit } from '@angular/core';

import { GitService } from '../../services/git.service';
import { IProfile } from '@models/profile';
import { IUser } from '@models/user';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public profile: IProfile;
    public user: IUser;

    constructor(private gitService: GitService) {
    }

    ngOnInit() {
        this.user = this.gitService.readUser();
        if (this.user) {
            this.gitService.getProfile(this.user.token).subscribe((data: IProfile) => {
                this.profile = data;
                console.log(data);
            });
        }
    }
}
