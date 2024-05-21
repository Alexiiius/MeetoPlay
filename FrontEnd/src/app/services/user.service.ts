import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../interfaces/user-data';
import { AuthService } from './auth.service';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';
import { SocialUser } from '../interfaces/social-user';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  currentUser: BehaviorSubject<UserData | null>;

  followedUsers: BehaviorSubject<SocialUser[] | null> = new BehaviorSubject<SocialUser[] | null>(null);
  friends: BehaviorSubject<SocialUser[] | null> = new BehaviorSubject<SocialUser[] | null>(null);

  private backAPIUrl = backAPIUrl;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.currentUser = new BehaviorSubject<UserData | null>(null);
    this.authService.userData.subscribe(user => this.currentUser.next(user));

  }

  ngOnInit(): void {
    this.authService.userData.subscribe(user => this.currentUser.next(user));
  }

  updateFollowedUsers(newFollowedUsers: SocialUser[]): void {
    this.followedUsers.next(newFollowedUsers);
  }

  updateFriends(newFriends: SocialUser[]): void {
    this.friends.next(newFriends);
  }

  changeUserStatus(newStatus: string) {
    const userData = this.currentUser.value;
    if (userData) {
      userData.status = newStatus;
      sessionStorage.setItem('user_data', JSON.stringify(userData));
      this.currentUser.next(userData);
    }
  }

  getFollowedUsers(): Observable<any>  {
    return this.http.get(`${this.backAPIUrl}/following/${this.currentUser.value?.id}`);
  }

  getFriends(): Observable<any>{
    return this.http.get(`${this.backAPIUrl}/friends/${this.currentUser.value?.id}`);
  }

  getUserById(id: number) {
    return this.http.get<UserData>(`${this.backAPIUrl}/user/${id}`);
  }
}

