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
export class UserStatusComponent implements OnInit {

  @Input() user: UserData | UserReduced | null = null;
  @Input() isLoading: boolean = false;
  @Input() sizeClass: 'small' | 'medium' | 'large' = 'medium';
  @Input() isChat: boolean = false;

  userStatus: String;


  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    if (!this.isChat){
      this.profileService.userStatusChanged.subscribe(
        (newStatus: string) => {
          this.userStatus = newStatus;
        }
      );
    }
  }

  ngOnChanges(): void {
    this.userStatus = this.user?.status || 'Offline';
  }
}
