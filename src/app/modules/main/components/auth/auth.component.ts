// ANGULAR
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// MAIN
import { GitService } from '../../services/git.service';
import { IProfile } from '@models/profile';
import { IToken } from '@models/token';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    public authForm: FormGroup;

    constructor(private gitService: GitService, private route: Router, private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.initForm();
        this.getCode();
    }

    private getCode(): void {
        this.router.queryParams.subscribe((params) => {
            if (params.code) {
                this.gitService.getToken(params.code).subscribe(
                    (resToken: IToken) => {
                        console.log(resToken);
                        this.gitService.getProfile(resToken.access_token).subscribe(
                            (resUser: IProfile) => {
                                console.log(resUser);
                                this.gitService.saveUser(resToken.access_token, resUser.login);
                            }
                        );
                    },
                );
            }
        });
    }

    private initForm(): void {
        this.authForm = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.pattern(/^[A-z0-9]*$/),
                Validators.minLength(3)]),
        });
    }

    private submitForm(form): void {
        this.auth(form.username);
    }

    private auth(login: string) {
        this.gitService.auth(login);
    }
}
