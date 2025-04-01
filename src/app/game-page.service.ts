import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Game } from './game-page/models/game';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GamePageService {
  http = inject(HttpClient);

  constructor() {}

  createGame(game: Game): Observable<any> {
    // console.log('username' + username, 'password' + password);
    // Return the HTTP POST request as an Observable
    const userid = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    const httpOptions = {
      headers: headers,
    };

    return this.http.post(
      `${environment.databaseUrl}/games/${userid}`,
      game,
      httpOptions
    );
  }

  updateGame(gameId: number, game: Game): Observable<any> {
    const userid = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    const httpOptions = {
      headers: headers,
    };
    return this.http.put(
      `${environment.databaseUrl}/games/${userid}/${gameId}`,
      game,
      httpOptions
    );
  }
}
