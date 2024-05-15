import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ExtraComponent } from './extra/extra.component';
import { UserStatusComponent } from '../user-status/user-status.component';
import { UserData } from '../../interfaces/user-data';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-profilecard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SettingsComponent,
    ExtraComponent,
    UserStatusComponent,
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

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser.subscribe(user => {
      this.user = user;
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
