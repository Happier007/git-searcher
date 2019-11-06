import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from '../../src/app/modules/main/components/auth/auth.component';


const routes: Routes = [
    // {path: '', redirectTo: '/auth', pathMatch: 'full'},
    {path: 'auth', component: AuthComponent},
    {path: 'auth/:code', component: AuthComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
