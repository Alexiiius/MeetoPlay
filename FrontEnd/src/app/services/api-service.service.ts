// game.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetGamesResponse } from '../interfaces/get-games-response';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private gamesUrl = 'assets/jsonGames.json';

  constructor(private http: HttpClient) { }

  getGames(): Observable<GetGamesResponse> {
    return this.http.get<GetGamesResponse>(this.gamesUrl);
  }
}
