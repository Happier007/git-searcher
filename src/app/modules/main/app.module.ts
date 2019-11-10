import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from '../../app-routing.module';
import { AppComponent } from '../../entrypoint/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './components/auth/auth.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfileComponent } from './components/profile/profile.component';
import { MatCardModule } from "@angular/material/card";
import { SearchComponent } from './components/search/search.component';
import { ListComponent } from './components/list/list.component';
import { MatDividerModule } from "@angular/material/divider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersCheckedComponent } from './components/users-checked/users-checked.component';


@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        NavBarComponent,
        ProfileComponent,
        SearchComponent,
        ListComponent,
        UserDetailComponent,
        UsersListComponent,
        UsersCheckedComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        MatToolbarModule,
        MatCardModule,
        MatDividerModule,
        MatCheckboxModule,
        MatIconModule,
        MatTableModule,
        MatTabsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
