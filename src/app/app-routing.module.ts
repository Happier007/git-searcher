import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent, ProfileComponent, SearchComponent } from '@main/components';
import { AuthGuard } from '@main/guards/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: '/search', pathMatch: 'full'},
    {path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
    {path: 'auth', component: AuthComponent},
    {path: 'profile', component: ProfileComponent},
    {path: '**', redirectTo: '/search', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
