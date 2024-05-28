import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  private userProfileId = new BehaviorSubject<number | null>(null);

  setUserProfileId(id: number) {
    this.userProfileId.next(id);
  }

  getUserProfileId() {
    return this.userProfileId.asObservable();
  }
}

