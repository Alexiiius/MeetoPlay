import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserData } from '../../interfaces/user-data';
import { CommonModule } from '@angular/common';

import { SocialsComponent } from './socials/socials.component';
import { forkJoin, Observable, tap } from 'rxjs';
import { UsersListComponent } from './users-list/users-list.component';
import { UserReduced } from '../../interfaces/user-reduced';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    SocialsComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    UsersListComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: UserData; //TODO create UserPublic interface
  isLoading = true;
  userFriends: UserReduced[] = [];
  userFollowed: UserReduced[] = [];
  userFollowers: UserReduced[] = [];

  @ViewChild(UsersListComponent) usersListComponent!: UsersListComponent;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.getUserById(params['id']).subscribe(user => {
        this.user = user;
        this.getUserRelations().subscribe(() => {
          this.isLoading = false;
        });
      });
    });
  }

  getUserRelations(): Observable<any> {
    const friends$ = this.userService.getFriends().pipe(tap(response => {
      this.userFriends = response.data.friends;
      console.log(this.userFriends)
    }));

    const followed$ = this.userService.getFollowedUsers().pipe(tap(response => {
      this.userFollowed = response.data.following;
    }));

    const followers$ = this.userService.getFollowers().pipe(tap(response => {
      this.userFollowers = response.data.followers;
    }));

    return forkJoin([friends$, followed$, followers$]);
  }

  isOverflow(element: any) {
    return element.scrollWidth > element.clientWidth;
  }

  checkRoute() {
    const url = this.router.url; // obtiene la URL actual
    const pattern = /^\/main\/profile\/[^\/]+\/gameStats$/; // patrón para verificar la URL

    return pattern.test(url); // devuelve true si la URL coincide con el patrón, false en caso contrario
  }

  openUserListModal(list: string, userList: UserReduced[]) {
    this.usersListComponent.openModal(list, userList);
  }

  closeuserListModal() {
    this.usersListComponent.closeModal();
  }
}
