// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { AppComponent } from '../../entrypoint/app.component';

// MATERIAL
import { AppMaterialModule } from '../material/app-material.module';

// MAIN
import {
    AuthComponent,
    NavBarComponent,
    ProfileComponent,
    SearchComponent,
    UserDetailComponent,
    UsersListComponent,
    UsersCheckedComponent
} from './components';


@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        NavBarComponent,
        ProfileComponent,
        SearchComponent,
        UserDetailComponent,
        UsersListComponent,
        UsersCheckedComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        AppMaterialModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
