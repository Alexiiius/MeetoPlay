import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../interfaces/user-data';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  currentUser: BehaviorSubject<UserData | null>;

  constructor(private authService: AuthService) {
    this.currentUser = new BehaviorSubject<UserData | null>(null);
    this.authService.userData.subscribe(user => this.currentUser.next(user));
  }

  ngOnInit(): void {
    this.authService.userData.subscribe(user => this.currentUser.next(user));
  }

  changeUserStatus(newStatus: string) {
    const userData = this.currentUser.value;
    if (userData) {
      userData.status = newStatus;
      sessionStorage.setItem('user_data', JSON.stringify(userData));
      this.currentUser.next(userData);
    }
  }
}

