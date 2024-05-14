import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSource = new BehaviorSubject(this.getUserData());
  currentUser = this.userSource.asObservable();

  constructor() { }

  getUserData() {
    const user = sessionStorage.getItem('user_data');
    return user ? JSON.parse(user) : {};
  }

  changeUserStatus(newStatus: string) {
    const userData = this.getUserData();
    userData.status = newStatus;
    sessionStorage.setItem('user_data', JSON.stringify(userData));
    this.userSource.next(userData);
  }
}

