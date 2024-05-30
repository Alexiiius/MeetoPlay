import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../interfaces/user-data';
import { AuthService } from './auth.service';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';
import { SocialUser } from '../interfaces/social-user';
import { FormatedNewGameStat } from '../interfaces/formated-new-game-stat';
import { FormatedNewGamemodeStat } from '../interfaces/formated-new-gamemode-stat';


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

  isFollowing(id: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/isfollowing/${id}`);
  }

  getFollowers(userId: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/followers/${userId}`);
  }

  getFollowedUsers(userId: number): Observable<any>  {
    return this.http.get(`${this.backAPIUrl}/following/${userId}`);
  }

  getFriends(userId: number): Observable<any>{
    return this.http.get(`${this.backAPIUrl}/friends/${userId}`);
  }

  getUserGameStats(userId: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/user/game-stats/search/${userId}`);
  }

  getUserById(id: number) {
    return this.http.get<UserData>(`${this.backAPIUrl}/user/${id}`);
  }

  getLogedUserData(): Observable<UserData> {
      return this.http.get<UserData>(this.backAPIUrl + '/user')
  }

  followUser(id: number): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/follow/${id}`,'');
  }

  unfollowUser(id: number): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/unfollow/${id}`,'');
  }

  postGameStat(gameStat: FormatedNewGameStat): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/user/game-stats/create`, gameStat);
  }

  deleteGameStat(gameStatId: number): Observable<any> {
    return this.http.delete(`${this.backAPIUrl}/user/game-stats/delete/${gameStatId}`);
  }

  postGamemodeStat(gameStat: FormatedNewGamemodeStat): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/user/game-stats/gamemode/create`, gameStat);
  }

  editGamemodeStat(gamemodeStat: FormatedNewGamemodeStat, gamemodeStatId: number): Observable<any> {
    return this.http.patch(`${this.backAPIUrl}/user/game-stats/gamemode/update/${gamemodeStatId}`, gamemodeStat);
  }

  deleteGamemodeStat(gamemodeStatId: number): Observable<any> {
    return this.http.delete(`${this.backAPIUrl}/user/game-stats/gamemode/delete/${gamemodeStatId}`);
  }
}

