// ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// RXJS
import { Observable, Subject } from 'rxjs';
// MODELS
import { IProfile } from '@models/profile';
import { IUser } from '@models/user';
import { IToken } from '@models/token';
import { ISearch } from '@models/search';
import { IRepos } from '@models/repos';
import { IGist } from '@models/gist';

import { environment } from '@environments/environment';
import { IQueryParams } from '@models/queryParams';


@Injectable({
    providedIn: 'root'
})

export class GitService {

    private clientId = environment.clientId;
    private clientSecret = environment.clientSecret;
    private redirectUri = environment.redirectUri;
    private key = 'token';
    private subject$ = new Subject<any>();

    constructor(private http: HttpClient,
                private route: ActivatedRoute,
                private router: Router) {
    }

    public auth(login: string) {
        const queryParams = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            login
        };
        const urlTree = this.router.createUrlTree(['oauth/authorize/'], {
            queryParams
        });

        location.href = `https://github.com/login${urlTree.toString()}`;
    }

    public getToken(code: string): Observable<IToken> {
        const headers = {
            Accept: 'application/json'
        };
        const params = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            redirect_uri: this.redirectUri
        };
        return this.http.post<IToken>('/login/oauth/access_token', params, {headers});
    }

    public getProfile(token: string): Observable<IProfile> {
        const headers = {
            Authorization: `token ${token}`
        };
        return this.http.get<IProfile>('https://api.github.com/user', {headers});
    }

    public getAuthUser(): Observable<any> {
        return this.subject$.asObservable();
    }

    public saveUser(token: string, username: string): void {
        const newUser: IUser = {
            username,
            token
        };
        localStorage.setItem(this.key, JSON.stringify(newUser));
        this.subject$.next(newUser);
    }

    public readUser(): IUser {
        return JSON.parse(localStorage.getItem(this.key));
    }

    public isAuth(): boolean {
        const authUser = this.readUser();
        if (authUser && authUser.token) {
            return true;
        } else {
            return false;
        }
    }

    public logout(): void {
        this.subject$.next();
        localStorage.setItem(this.key, JSON.stringify(null));
        this.router.navigate(['/auth']);
    }

    public searchUsers(username: string, page: number, perPage: number): Observable<ISearch> {
        const params = new HttpParams()
            .append('q', `${username}in:login`)
            .append('page', String(page + 1))
            .append('per_page', String(perPage));
        return this.http.get<ISearch>('https://api.github.com/search/users', {params});
    }

    public userProfile(username: string): Observable<IProfile> {
        return this.http.get<IProfile>(`https://api.github.com/users/${username}`);
    }

    public getRepos(url: string, page: number): Observable<IRepos[]> {
        const params = new HttpParams()
            .append('page', String(page + 1))
            .append('per_page', '10');
        return this.http.get<IRepos[]>(url, {params});
    }

    public getGists(url: string, page: number): Observable<IGist[]> {
        const params = new HttpParams()
            .append('page', String(page + 1))
            .append('per_page', '10');
        return this.http.get<IGist[]>(`${url}/gists`, {params});
    }

    public getRouteParams(): IQueryParams {
        return {
            q: this.route.snapshot.queryParamMap.get('q'),
            id: +this.route.snapshot.queryParamMap.get('id') || null,
            page: +this.route.snapshot.queryParamMap.get('page') || 0,
            pageSize: +this.route.snapshot.queryParamMap.get('per_page') || 10
        };
    }
}
