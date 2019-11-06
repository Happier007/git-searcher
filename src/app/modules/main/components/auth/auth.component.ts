import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GitService } from '../../services/git.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    public authForm: FormGroup;
    public code: string;
    public token: string;

    constructor(private gitService: GitService, private route: Router, private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.initForm();
        this.getCode();
    }

    private getCode(): void {
        this.router.queryParams.subscribe((data) => {
            if (data.code) {
                console.log(1, data.code);
                this.gitService.getToken(data.code).subscribe(
                    (res) => console.log(res),
                    (error) => console.log(error)
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
