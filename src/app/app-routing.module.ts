import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent, ProfileComponent, SearchComponent } from './modules/main/components';


const routes: Routes = [
    // {path: '', redirectTo: '/auth', pathMatch: 'full'},
    {path: 'auth', component: AuthComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'search', component: SearchComponent},
    {path: 'search/:username:id', component: SearchComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
