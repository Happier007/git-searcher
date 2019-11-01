import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitService {

  constructor(private http: HttpClient) {
  }

  public authenticate(login: string, password: string) {
    return this.http.get(`https://api.github.com/repos/${login}/${password}/commits`);
  }

}
