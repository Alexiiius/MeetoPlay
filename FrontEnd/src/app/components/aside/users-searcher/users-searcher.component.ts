import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserReduced } from '../../../interfaces/user-reduced';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin, Subject, takeUntil } from 'rxjs';
import { UserReduceFollowing } from '../../../interfaces/user-reduce-following';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { UserData } from '../../../interfaces/user-data';

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

  logedUser: UserData;

  isSearching: boolean = false;
  searchInitiated: boolean = false;
  isFollowingLoading: { [userId: number]: boolean } = {};

  private searchCanceled = new Subject<void>();

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

    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.logedUser = user;
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
    console.log('searching users');
    this.checkedResults = [];
    this.searchInitiated = false;
    this.isSearching = true;
    this.searchCanceled.next();
    this.userService.getUsersSearch(this.search.value || '')
      .pipe(takeUntil(this.searchCanceled))
      .subscribe((results: UserReduced[]) => {
        this.searchResults = results;
        this.searchInitiated = true;
        this.checkFollowing();
      });
  }

  //Comprueba si cada usuario de la lista de resultados está siendo seguido por el usuario actual
  checkFollowing() {
    console.log('checking following' , this.searchResults);
    let userList = this.searchResults;

    if (userList.length > 8) {
      userList = userList.slice(0, 8);
    }
    console.log('userList', userList);

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
}
