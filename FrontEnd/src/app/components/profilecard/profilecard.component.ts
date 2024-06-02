import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ExtraComponent } from './extra/extra.component';
import { UserStatusComponent } from '../user-status/user-status.component';
import { UserData } from '../../interfaces/user-data';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import {  Subscription } from 'rxjs';
import { HomeComponent } from './home/home.component';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

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
export class ProfilecardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('avatar', { static: false }) avatar: ElementRef;

  isLoggingOut = false;
  user: UserData | null = null;
  userAvatarLoaded = false;
  private userSubscription: Subscription;

  constructor(private userService: UserService, private cdRef: ChangeDetectorRef) { }

  profileService = inject(ProfileService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser.subscribe(user => {
      this.user = user;
      console.log('User:', user);
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

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.avatar && this.avatar.nativeElement && this.avatar.nativeElement.complete) {
        this.onAvatarLoad();
      }
    }, 0);
  }

  onAvatarLoad() {
    this.userAvatarLoaded = true;
    this.cdRef.detectChanges();
  }
}
