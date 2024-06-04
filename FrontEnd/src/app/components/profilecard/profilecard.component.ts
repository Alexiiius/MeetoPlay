import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ExtraComponent } from './extra/extra.component';
import { UserData } from '../../interfaces/user-data';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { UserStatusComponent } from './user-status/user-status.component';

@Component({
  selector: 'app-profilecard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SettingsComponent,
    ExtraComponent,
    UserStatusComponent,
    HomeComponent,
    CommonModule
  ],
  templateUrl: './profilecard.component.html',
  styleUrl: './profilecard.component.css'
})
export class ProfilecardComponent implements OnInit {
  @ViewChild('avatar', { static: false }) avatar: ElementRef;

  user: UserData | null = null;
  userAvatarLoaded = false;

  isLoading: boolean = false;

  constructor(private userService: UserService) { }

  profileService = inject(ProfileService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getLogedUserData().subscribe((user: UserData) => {
      this.user = user;
      this.isLoading = false;
    });

    this.profileService.profileAvatarUpdated.subscribe((newAvatarUrl: string) => {
      if (this.user) {
        this.user.avatar = newAvatarUrl + '?t=' + Date.now();
      }
    });

    this.profileService.profileNameUpdated.subscribe((newName: string) => {
      if (this.user) {
        this.user.name = newName;
      }
    });
  }
}
