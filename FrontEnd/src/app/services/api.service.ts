// game.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { gamesApiUrl } from '../config';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  // private gamesUrl = 'assets/jsonGames.json';

  constructor(private http: HttpClient) { }

  // getGames(): Observable<GetGamesResponse> {
  //   return this.http.get<GetGamesResponse>(this.gamesUrl);
  // }

  loginAPI() {
    const credentials =
    {
      email: 'admin@admin.com',
      password: 'admin'
    }
    return this.http.post<any>(gamesApiUrl + '/login', credentials).pipe(
      tap(response => {
        if (response && response.data.access_token) {
          const token = response.data.access_token.split('|')[1];
          localStorage.setItem('api_token', token);
        }
      }),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(gamesApiUrl + '/games');
  }

  getFullGame(gameId: number): Observable<any> {
    return this.http.get(gamesApiUrl + '/game/' + gameId );
  }
}
