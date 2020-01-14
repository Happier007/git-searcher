import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GitService } from '@services/git.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private gitService: GitService) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot):
        Observable<boolean> | Promise<boolean> | boolean {

        if (this.gitService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/auth'], {
                queryParams: {
                    auth: false
                }
            });
        }
    }

}
