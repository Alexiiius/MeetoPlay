import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserReduced } from '../../../interfaces/user-reduced';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { UserReduceFollowing } from '../../../interfaces/user-reduce-following';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-users-searcher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './users-searcher.component.html',
  styleUrl: './users-searcher.component.css'
})
export class UsersSearcherComponent implements OnInit {

  userService = inject(UserService);
  profileService = inject(ProfileService);

  search = new FormControl('');
  searchResults: UserReduced[] = [];
  checkedResults: UserReduceFollowing[] = [];

  logedUserId: number = this.userService.currentUser.value?.id || 0;

  isSearching: boolean = false;
  searchInitiated: boolean = false;
  isFollowingLoading: { [userId: number]: boolean } = {};

  constructor() { }

  ngOnInit(): void {
    this.search.valueChanges.pipe(
      debounceTime(300), // espera 300ms después de cada cambio
      distinctUntilChanged() // emite solo si el valor actual es diferente del último
    ).subscribe(searchValue => {
      if (searchValue !== '') {
        this.searchUsers();
      } else {
        this.isSearching = false;
        this.checkedResults = [];
      }
    });

    this.profileService.userFollowed.subscribe(userId => {
      const user = this.checkedResults.find(user => user.id === userId);
      if (user) {
        user.isFollowing = true;
      }
    });

    this.profileService.userUnFollowed.subscribe(userId => {
      const user = this.checkedResults.find(user => user.id === userId);
      if (user) {
        user.isFollowing = false;
      }
    });
  }

  searchUsers() {
    this.checkedResults = [];
    this.searchInitiated = true;
    this.isSearching = true;
    this.userService.getUsersSearch(this.search.value || '').subscribe((results: UserReduced[]) => {
      this.searchResults = results;
      this.checkFollowing();
    });
  }

  //Comprueba si cada usuario de la lista de resultados está siendo seguido por el usuario actual
  checkFollowing() {
    const userList = this.searchResults;
    if (userList.length === 0) {
      this.isSearching = false;
      this.checkedResults = [];
      return;
  }
    const observables = userList.map(user => this.userService.isFollowing(user.id));

    forkJoin(observables).subscribe(results => {
      this.checkedResults = userList.map((user, index) => ({
        ...user,
        isFollowing: results[index].data.boolean
      })) as UserReduceFollowing[];

      this.isSearching = false;
    });
  }

  followUser(userId: number) {
    this.isFollowingLoading[userId] = true;
    this.userService.followUser(userId).subscribe(() => {
      const user = this.checkedResults.find(user => user.id === userId);
      if (user) {
        user.isFollowing = true;
        this.profileService.userFollowed.next(userId);
      }
      this.isFollowingLoading[userId] = false;

    });
  }

  isLogedUser(userId: number): boolean {
    return this.logedUserId === userId;
  }
}
