import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor() { }

  http = inject(HttpClient);

  getMatchHistory(): Observable<any> {
    const userid = localStorage.getItem('id');

    return this.http.get<any>(`${environment.databaseUrl}/games/${userid}/history`);
  }
  
}
