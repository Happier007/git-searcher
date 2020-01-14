import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// MATERIAL
import { AppMaterialModule } from '../material/app-material.module';

import {
    AuthComponent,
    NavBarComponent,
    ProfileComponent,
    SearchComponent,
    SearchDetailComponent,
    SearchCheckedComponent,
    UserDetailComponent
} from './components';
import { MatProgressBarModule } from "@angular/material/progress-bar";



@NgModule({
    declarations: [
        AuthComponent,
        NavBarComponent,
        ProfileComponent,
        SearchComponent,
        SearchDetailComponent,
        SearchCheckedComponent,
        UserDetailComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppMaterialModule,
        RouterModule,
        MatProgressBarModule
    ],
    exports: [
        NavBarComponent,
    ]
})
export class MainModule {
}
