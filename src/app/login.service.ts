import { inject, Injectable } from '@angular/core';
import { Login } from './login-page/models/login';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  http = inject(HttpClient);

  login(login: Login): Observable<any> {
    const password = login.password;
    const username = login.username;
    console.log('username' + username, 'password' + password);
    // Return the HTTP POST request as an Observable
    return this.http.post(`${environment.databaseUrl}/auth/login`, {
      username,
      password,
    });
  }
}
