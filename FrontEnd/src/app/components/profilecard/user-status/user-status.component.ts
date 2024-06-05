import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserData } from '../../../interfaces/user-data';
import { ProfileService } from '../../../services/profile.service';
import { UserReduced } from '../../../interfaces/user-reduced';

@Component({
  selector: 'app-user-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-status.component.html',
  styleUrl: './user-status.component.css'
})
export class UserStatusComponent implements OnInit, OnDestroy {

  @Input() user: UserData | UserReduced | null = null;
  @Input() isLoading: boolean = false;
  @Input() sizeClass: 'small' | 'medium' | 'large' = 'medium';
  @Input() isChat: boolean = false;

  userStatus: String;
  private subscription: Subscription;

  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    if (!this.isChat){
      this.subscription = this.profileService.userStatusChanged.subscribe(
        (newStatus: string) => {
          this.userStatus = newStatus;
        }
      );
    }
  }

  ngOnChanges(): void {
    this.userStatus = this.user?.status || 'Offline';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
