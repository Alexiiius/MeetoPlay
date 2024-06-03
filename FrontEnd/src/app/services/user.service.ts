import { UserData } from './../interfaces/user-data';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, merge, Observable, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';
import { SocialUser } from '../interfaces/social-user';
import { FormatedNewGameStat } from '../interfaces/formated-new-game-stat';
import { FormatedNewGamemodeStat } from '../interfaces/formated-new-gamemode-stat';
import { GameStat } from '../interfaces/game-stat';
import { ProfileService } from './profile.service';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  currentUser: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);

  followedUsers: BehaviorSubject<SocialUser[] | null> = new BehaviorSubject<SocialUser[] | null>(null);
  friends: BehaviorSubject<SocialUser[] | null> = new BehaviorSubject<SocialUser[] | null>(null);

  gameStatCreated$ = this.profileService.gameStatCreated.asObservable();
  gameStatEdited$ = this.profileService.gameStatEdited.asObservable();
  gameStatDeleted$ = this.profileService.gameStatDeleted.asObservable();

  gamemodeStatCreated$ = this.profileService.gamemodeStatCreated.asObservable();
  gamemodeStatEdited$ = this.profileService.gamemodeStatEdited.asObservable();
  gamemodeStatEditCancelled$ = this.profileService.gamemodeStatEditCancelled.asObservable();
  gamemodeStatDeleted$ = this.profileService.gamemodeStatDeleted.asObservable();

  anyGameStatActivity$ = merge(
    this.gameStatCreated$,
    this.gameStatEdited$,
    this.gameStatDeleted$,
    this.gamemodeStatCreated$,
    this.gamemodeStatEdited$,
    this.gamemodeStatEditCancelled$,
    this.gamemodeStatDeleted$
  );

  userStatusChanged = new Subject<string>();

  private backAPIUrl = backAPIUrl;

  constructor(private authService: AuthService, private http: HttpClient, private profileService: ProfileService) {
    this.currentUser = new BehaviorSubject<UserData | null>(null);
    this.authService.userData.subscribe(user => {
      this.currentUser.next(user)
      if (user) {
        this.getLoggedUserGameStats().subscribe();
        this.anyGameStatActivity$.subscribe(() => this.getLoggedUserGameStats().subscribe());
      }
    });
  }

  ngOnInit(): void {
    this.authService.userData.subscribe(user => this.currentUser.next(user));
  }

  getCurrentUser(): Observable<UserData | null> {
    return this.currentUser.asObservable();
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
  getUsersSearch(search: string): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/user/search/${search}`);
  }

  deleteUser(password: string): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/user/delete`, { password: password });
  }

  isFollowing(id: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/isfollowing/${id}`);
  }

  getFollowers(userId: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/followers/${userId}`);
  }

  getFollowedUsers(userId: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/following/${userId}`);
  }

  getFriends(userId: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/friends/${userId}`);
  }

  getUserGameStats(userId: number): Observable<any> {
    return this.http.get(`${this.backAPIUrl}/user/game-stats/search/${userId}`);
  }

  getLoggedUserGameStats(): Observable<GameStat | null> {
    return this.currentUser.pipe(
      switchMap((user: UserData | null) => {
        if (user) {
          return this.http.get<any>(`${this.backAPIUrl}/user/game-stats/search/${user.id}`).pipe(
            tap(response => this.profileService.gameStatsSource.next(response.data.GameUserStats as GameStat[]))
          );
        } else {
          throw new Error('User is not logged in');
        }
      })
    );
  }

  getUserById(id: number) {
    return this.http.get<UserData>(`${this.backAPIUrl}/user/${id}`);
  }

  getLogedUserData(): Observable<UserData> {
    return this.http.get<UserData>(this.backAPIUrl + '/user')
  }

  getCurrentEmail(): Observable<string> {
    return this.http.get<UserData>(this.backAPIUrl + '/user').pipe(
      map(user => user.email)
    );
  }

  followUser(id: number): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/follow/${id}`, '');
  }

  unfollowUser(id: number): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/unfollow/${id}`, '');
  }

  postGameStat(gameStat: FormatedNewGameStat): Observable<any> {
    return this.http.post(`${this.backAPIUrl}/user/game-stats/create`, gameStat);
  }

  editGameStat(gameStat: FormatedNewGameStat, gameStatId: number): Observable<any> {
    return this.http.put(`${this.backAPIUrl}/user/game-stats/update/${gameStatId}`, gameStat);
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

  setUserStatus(status: string): Observable<any> {
    return this.http.patch(`${this.backAPIUrl}/user/status/${status}`, '');
  }
}

