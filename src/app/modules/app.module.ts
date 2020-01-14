// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../entrypoint/app.component';

// MATERIAL
import { AppMaterialModule } from './material/app-material.module';

import { LogInterseptor } from './main/interceptors/log.interseptor';
import { MainModule } from './main/main.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,

        // MODULES
        MainModule,
        AppMaterialModule
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
