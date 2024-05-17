import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../interfaces/user-data';
import { AuthService } from './auth.service';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  currentUser: BehaviorSubject<UserData | null>;

  private backAPIUrl = backAPIUrl;

  constructor(private authService: AuthService, private http: HttpClient) {
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

  getfollowedUsers() {
    return this.http.get(`${this.backAPIUrl}/following/${this.currentUser.value?.id}`);
  }

  getFriends() {
    return this.http.get(`${this.backAPIUrl}/friends/${this.currentUser.value?.id}`);
  }
}

