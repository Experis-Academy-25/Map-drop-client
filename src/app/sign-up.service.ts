import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Signup } from './sign-up-page/models/sign-up';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  http = inject(HttpClient);

  constructor() { }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.databaseUrl}/users/username/${username}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    const lowerCaseEmail = email.toLowerCase();
    return this.http.get<boolean>(`${environment.databaseUrl}/users/email/${lowerCaseEmail}` );
  }

  async createUser(user: Signup): Promise<Signup> {
    const newUser = await firstValueFrom(
      this.http.post(`${environment.databaseUrl}/auth/signup`, {
        username: user.username,
        email: user.email.toLowerCase(),
        password: user.password
      })
    );
    console.log(newUser);
    // @ts-ignore
    return newUser;
  }
}
