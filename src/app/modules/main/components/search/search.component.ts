import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    private searchForm: FormGroup;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.initForm();
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
         this.router.navigate(['/search'], {queryParams: {q: form.username}} );
         // this.router.navigate(['/search', id], {queryParams: {q: form.username}, relativeTo: this.route });
         // this.router.navigateByUrl('/search?q=' + form.username);
    }
}
