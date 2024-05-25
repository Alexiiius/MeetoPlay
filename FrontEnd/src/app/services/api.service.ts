// game.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { gamesApiUrl } from '../config';
import { Game } from '../models/game';
import { FullGame } from '../models/fullgame';
import { NewFullGame } from '../interfaces/new-fullGame';

@Injectable({
  providedIn: 'root'
})
export class APIService {


  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(gamesApiUrl + '/games');
  }

  getFullGame(gameId: number): Observable<FullGame> {
    return this.http.get<FullGame>(gamesApiUrl + '/game/' + gameId);
  }

  newGetFullGame(gameId: number): Observable<NewFullGame> {
    return this.http.get<{ game: NewFullGame }>(gamesApiUrl + '/game/' + gameId).pipe(
      map(response => response.game)
    );
  }
}
