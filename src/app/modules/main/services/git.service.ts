import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class GitService {

    public token: string;
    private clientId = 'b9d368bff03d87c7b9ae';
    private clientSecret = '5f65b02ff642bf23560f6f73d793b4f1b8387b70';
    private redirectUri = 'http://localhost:4200/auth';
    private authUrl = 'https://github.com/login/oauth/';
    private key = 'token';

    constructor(private http: HttpClient, private router: Router) {
    }

    public auth(login: string) {
        window.location.href = `${this.authUrl}authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&login=${login}`;
    }

    public getToken(code: string): Observable<any> {

        const params = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            redirect_uri: this.redirectUri
        }

        console.log(555, code);
        return this.http.post('/login/oauth/access_token', params, {responseType: 'text'});
    }

    public saveToken(): void {
        localStorage.setItem(this.key, JSON.stringify(this.token));
    }

    public readToken(): string {
        return JSON.parse(localStorage.getItem(this.key));
    }
}

// let headers = new HttpHeaders();
// headers = headers
// tslint:disable-next-line:max-line-length
//     .set('Access-Control-Expose-Headers', 'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval')
//     .set('Access-Control-Max-Age', '86400')
// tslint:disable-next-line:max-line-length
//     .set('Access-Control-Allow-Headers', 'Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, Accept-Encoding, X-GitHub-OTP, X-Requested-With, User-Agent')
//     .set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
//     .set('Access-Control-Allow-Origin', '*.github.com');
// .set('Access-Control-Allow-Origin', '*')
// .set('Access-Control-Allow-Methods', 'POST')
// .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token , Authorization');

// const params = new HttpParams();
// params.append('client_id', this.clientId);
// params.append('client_secret', this.clientSecret);
// params.append('code', code);
// params.append('redirect_uri', this.redirectUri);

// let params = {
//     client_id: this.clientId,
//     client_secret: this.clientSecret,
//     code,
//     redirect_uri: this.redirectUri
// }
