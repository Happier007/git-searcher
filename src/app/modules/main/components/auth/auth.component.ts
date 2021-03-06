// ANGULAR
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// RXJS
import { switchMap, takeUntil, tap } from 'rxjs/operators';
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

    public authForm: FormGroup = this.buildForm();
    private destroy$: Subject<void> = new Subject<void>();
    private token: string;
    private authCode: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private gitService: GitService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
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
                    this.router.navigate(['/search']);
                }
            );
        }
    }

    private buildForm(): FormGroup {
        return this.fb.group({
            username: new FormControl('', [
                Validators.required]),
        });
    }

    private submitForm(form): void {
        this.auth(form.username);
    }

    private auth(login: string): void {
        this.gitService.auth(login);
    }
}
