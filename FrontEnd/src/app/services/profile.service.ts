import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GameStat } from '../interfaces/game-stat';
import { GamemodeStat } from '../interfaces/gamemode-stat';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  backAPIUrl = backAPIUrl;
  http = inject(HttpClient);

  private userProfileId = new BehaviorSubject<number | null>(null);

  eventDeleted = new Subject<void>();
  gameStatCreated = new Subject<GameStat>();
  gameStatEdited = new Subject<GameStat>();
  gameStatDeleted = new Subject<number>();

  gamemodeStatCreated = new Subject<GamemodeStat>();
  gamemodeStatEdited = new Subject<GamemodeStat>();
  gamemodeStatEditCancelled = new Subject<GamemodeStat>();
  gamemodeStatDeleted = new Subject<number>();

  profileAvatarUpdated = new Subject<string>();

  setUserProfileId(id: number) {
    this.userProfileId.next(id);
  }

  getUserProfileId() {
    return this.userProfileId.asObservable();
  }

  updateAvatar(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', imageFile);
    return this.http.post(`${this.backAPIUrl}/user/avatar/update`, formData);
  }
}

