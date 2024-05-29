import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormatedNewGameStat } from '../interfaces/formated-new-game-stat';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  private userProfileId = new BehaviorSubject<number | null>(null);

  eventDeleted = new Subject<void>();

  setUserProfileId(id: number) {
    this.userProfileId.next(id);
  }

  getUserProfileId() {
    return this.userProfileId.asObservable();
  }
}

