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


  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(gamesApiUrl + '/games');
  }

  getFullGame(gameId: number): Observable<any> {
    return this.http.get(gamesApiUrl + '/game/' + gameId);
  }
}
