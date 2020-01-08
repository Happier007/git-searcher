// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
    SearchDetailComponent,
    SearchCheckedComponent
} from './components';
import { LogInterseptor } from './interceptors/log.interseptor';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        NavBarComponent,
        ProfileComponent,
        SearchComponent,
        SearchDetailComponent,
        SearchCheckedComponent
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
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LogInterseptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
