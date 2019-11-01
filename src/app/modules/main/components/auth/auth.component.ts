import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public authForm: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.authForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-z0-9]*$/),
        Validators.minLength(3)]),
      password: new FormControl(),
    });
  }

  private submitForm(form): void {
    console.log(form);
  }
}
