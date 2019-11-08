import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { IProfile } from '../../../models/profile';
import { IUser } from '../../../models/user';
import { IToken } from '@models/token';
import { ISearch } from "@models/search";

@Injectable({
    providedIn: 'root'
})

export class GitService {

    private clientId = 'b9d368bff03d87c7b9ae';
    private clientSecret = '5f65b02ff642bf23560f6f73d793b4f1b8387b70';
    private redirectUri = 'http://localhost:4200/auth';
    private authUrl = 'https://github.com/login/oauth/';
    private key = 'token';

    private subject$ = new Subject<any>();

    constructor(private http: HttpClient, private router: Router) {
    }

    public auth(login: string) {
        window.location.href = `${this.authUrl}authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&login=${login}`;
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
            Authorization: 'token ' + token
        };
        return this.http.get<IProfile>('https://api.github.com/user', {headers});
    }

    public sendMessage(user: IUser): void {
        this.subject$.next(user);
    }

    public getMessage(): Observable<any> {
        return this.subject$.asObservable();
    }

    public saveUser(token: string, username: string): void {
        const newUser: IUser = {
            username,
            token
        };
        localStorage.setItem(this.key, JSON.stringify(newUser));
        this.sendMessage(newUser);
    }

    public readUser(): IUser {
        return JSON.parse(localStorage.getItem(this.key));
    }

    public logout(): void {
        console.log('12345');
        this.subject$.next();
        localStorage.setItem(this.key, JSON.stringify(null));
        this.router.navigate(['/auth']);
    }

    public searchUsers(username: string): Observable<ISearch> {
        return this.http.get<ISearch>(`https://api.github.com/search/users?q=${username}+in:login`);
    }

    public users(username: string): Observable<IProfile> {
        return this.http.get<IProfile>(`https://api.github.com/search/users?q=${username}`);
    }
    // https://api.github.com/users/Happier007
}
