import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserData } from '../../interfaces/user-data';
import { CommonModule } from '@angular/common';

import { SocialsComponent } from './socials/socials.component';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { UsersListComponent } from './users-list/users-list.component';

import { UserReduceFollowing } from '../../interfaces/user-reduce-following';
import { ProfileService } from '../../services/profile.service';
import { GameStatFormComponent } from './game-stat-form/game-stat-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    SocialsComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    UsersListComponent,
    GameStatFormComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: UserData; //TODO create UserPublic interface
  isLoading = true;

  userFriends: UserReduceFollowing[] = [];
  userFollowed: UserReduceFollowing[] = [];
  userFollowers: UserReduceFollowing[] = [];

  logedUser: UserData;
  isLoggedUser: boolean;
  isFollowing: boolean;
  isRelationsLoading: boolean;
  isLoadingFollow_Unfollow: boolean = false;

  @ViewChild(UsersListComponent) usersListComponent!: UsersListComponent;
  @ViewChild(GameStatFormComponent) gameStatFormComponent!: GameStatFormComponent;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private profileService: ProfileService) { }

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.isLoading = true;
        this.userService.getUserById(params['id']).subscribe(user => {
          this.user = user;
          this.profileService.setUserProfileId(user.id);

          this.isRelationsLoading = true;
          this.getUserRelations(this.user.id).subscribe(() => {
            this.isRelationsLoading = false;
          });

          forkJoin([
            this.checkIfLoggedUser(),
            this.checkIfFollowing()
          ]).subscribe(([isLoggedUser, isFollowing]) => {
            this.isLoggedUser = isLoggedUser;
            this.isFollowing = isFollowing;
            this.isLoading = false;
          });
        });
      });
    }

  updateFollowCounts() {
    this.checkIfLoggedUser().subscribe(isLoggedUser => {
      if (isLoggedUser) {
        this.getUserRelations(this.user.id).subscribe();
      }
    });
  }

  getUserRelations(userId: number): Observable<any> {
    const friends$ = this.userService.getFriends(userId).pipe(
      tap(response => {
        this.userFriends = response.data.friends;
      }),
      catchError(error => {
        console.error('Error getting friends:', error);
        return of(null);
      })
    );

    const followed$ = this.userService.getFollowedUsers(userId).pipe(
      tap(response => {
        this.userFollowed = response.data.following;
      }),
      catchError(error => {
        console.error('Error getting followed users:', error);
        return of(null);
      })
    );

    const followers$ = this.userService.getFollowers(userId).pipe(
      tap(response => {
        this.userFollowers = response.data.followers;
      }),
      catchError(error => {
        console.error('Error getting followers:', error);
        return of(null);
      })
    );

    return forkJoin([friends$, followed$, followers$]);
  }

  checkIfLoggedUser(): Observable<boolean> {
    return this.userService.getLogedUserData().pipe(
      tap(user => this.logedUser = user), // Almacena el usuario conectado en this.logedUser
      map(user => user.id === this.user.id)
    );
  }

  isOverflow(element: any) {
    return element.scrollWidth > element.clientWidth;
  }

  checkRoute() {
    const url = this.router.url; // obtiene la URL actual
    const pattern = /^\/profile\/[^\/]+\/gameStats$/;// patrón para verificar la URL

    return pattern.test(url); // devuelve true si la URL coincide con el patrón, false en caso contrario
  }

  openUserListModal(list: string, userList: UserReduceFollowing[]) {
    this.usersListComponent.openModal(list, userList);
  }

  openGameStatFormModal() {
    this.gameStatFormComponent.openModal();
  }

  closeuserListModal() {
    this.usersListComponent.closeModal();
  }

  checkIfFollowing(): Observable<boolean> {
    return this.userService.isFollowing(this.user.id).pipe(
      map(response => response.data.boolean)
    );
  }

  unfollowUser() {
    this.isLoadingFollow_Unfollow = true;
    this.userService.unfollowUser(this.user.id).subscribe(() => {
      this.isFollowing = false;
      this.getUserRelations(this.user.id).subscribe();
      this.isLoadingFollow_Unfollow = false;
    });
  }

  followUser() {
    this.isLoadingFollow_Unfollow = true;
    this.userService.followUser(this.user.id).subscribe(() => {
      this.isFollowing = true;
      this.getUserRelations(this.user.id).subscribe();
      this.isLoadingFollow_Unfollow = false;
    });
  }
}
