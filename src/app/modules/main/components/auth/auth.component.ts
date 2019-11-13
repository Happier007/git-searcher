// ANGULAR
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// RXJS
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

// MODELS
import { IProfile } from '@models/profile';
import { IToken } from '@models/token';

// MAIN
import { GitService } from '@services/git.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

    public authForm: FormGroup;
    private destroy$: Subject<void> = new Subject<void>();
    public authCode: string;
    private token: string;

    constructor(private gitService: GitService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.initForm();
        this.getCode();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getCode(): void {

        this.authCode = this.route.snapshot.queryParamMap.get('code');
        if (this.authCode) {
            this.gitService.getToken(this.authCode)
                .pipe(
                    tap((resToken: IToken) => this.token = resToken.access_token),
                    switchMap((resToken: IToken) => this.gitService.getProfile(resToken.access_token)),
                    takeUntil(this.destroy$)
                ).subscribe(
                    (resUser: IProfile) => {
                        this.gitService.saveUser(this.token, resUser.login);
                        window.location.href = '/search';
                    }
            );
        }
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
