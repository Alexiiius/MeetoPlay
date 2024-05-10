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

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(gamesApiUrl + '/games');
  }

  getFullGame(gameId: number): Observable<any> {
    return this.http.get(gamesApiUrl + '/game/' + gameId);
  }
}
