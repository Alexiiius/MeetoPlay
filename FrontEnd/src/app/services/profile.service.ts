import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormatedNewGameStat } from '../interfaces/formated-new-game-stat';
import { GameStat } from '../interfaces/game-stat';
import { GamemodeStat } from '../interfaces/gamemode-stat';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  private userProfileId = new BehaviorSubject<number | null>(null);

  eventDeleted = new Subject<void>();
  gameStatCreated = new Subject<GameStat>();
  gameStatEdited = new Subject<GameStat>();
  gameStatDeleted = new Subject<number>();

  gamemodeStatCreated = new Subject<GamemodeStat>();
  gamemodeStatEdited = new Subject<GamemodeStat>();
  gamemodeStatEditCancelled = new Subject<GamemodeStat>();
  gamemodeStatDeleted = new Subject<number>();

  setUserProfileId(id: number) {
    this.userProfileId.next(id);
  }

  getUserProfileId() {
    return this.userProfileId.asObservable();
  }
}

