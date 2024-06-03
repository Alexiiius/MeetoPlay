import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GameStat } from '../interfaces/game-stat';
import { GamemodeStat } from '../interfaces/gamemode-stat';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';
import { UserSocials } from '../interfaces/user-socials';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  backAPIUrl = backAPIUrl;
  http = inject(HttpClient);

  private userProfileId = new BehaviorSubject<number | null>(null);

  eventCreated = new Subject<void>();
  eventEdited = new Subject<void>();
  eventDeleted = new Subject<void>();

  gameStatCreated = new Subject<GameStat>();
  gameStatEdited = new Subject<GameStat>();
  gameStatDeleted = new Subject<number>();

  gamemodeStatCreated = new Subject<GamemodeStat>();
  gamemodeStatEdited = new Subject<GamemodeStat>();
  gamemodeStatEditCancelled = new Subject<GamemodeStat>();
  gamemodeStatDeleted = new Subject<number>();

  profileAvatarUpdated = new Subject<string>();
  profileNameUpdated = new Subject<string>();
  profileBioUpdated = new Subject<string>();

  userFollowed = new Subject<number>();
  userUnFollowed = new Subject<number>();

  gameStatsSource = new BehaviorSubject<GameStat[] | []>([]);
  gameStats$ = this.gameStatsSource.asObservable();


  setUserProfileId(id: number) {
    this.userProfileId.next(id);
  }

  getUserProfileId() {
    return this.userProfileId.asObservable();
  }

  updateAvatar(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', imageFile);
    console.log(imageFile);
    return this.http.post(`${this.backAPIUrl}/user/avatar/update`, formData);
  }

  updateSocials(socials: UserSocials): Observable<any> {
    console.log(socials);
    return this.http.patch(`${this.backAPIUrl}/user/socials/update`, { socials: socials });
  }

  updateName(name: string, password: string): Observable<any> {
    return this.http.patch(`${this.backAPIUrl}/user/name/update`, { name: name, password: password });
  }

  updateBio(bio: string): Observable<any> {
    return this.http.patch(`${this.backAPIUrl}/user/bio/update`, { bio: bio });
  }

  updateEmail(email: string, password: string): Observable<any> {
    return this.http.patch(`${this.backAPIUrl}/user/email/update`, { email: email, password: password });
  }

  updatePassword(newPassword: string, password: string): Observable<any> {
    return this.http.patch(`${this.backAPIUrl}/user/password/update`, { password: password, new_password: newPassword });
  }
}

