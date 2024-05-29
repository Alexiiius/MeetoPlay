import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  private userProfileId = new BehaviorSubject<number | null>(null);

  eventDeleted = new Subject<void>();
  gameStatCreated = new Subject<void>();

  setUserProfileId(id: number) {
    this.userProfileId.next(id);
  }

  getUserProfileId() {
    return this.userProfileId.asObservable();
  }
}

