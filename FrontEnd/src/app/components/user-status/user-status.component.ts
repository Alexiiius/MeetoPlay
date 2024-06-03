import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserData } from '../../interfaces/user-data';

@Component({
  selector: 'app-user-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-status.component.html',
  styleUrl: './user-status.component.css'
})
export class UserStatusComponent implements OnDestroy {

  @Input() user: UserData | null = null;
  @Input() isLoading: boolean;
  @Input() sizeClass: string;

  userStatus: String;
  private subscription: Subscription;

  constructor() {}

  ngOnChanges(): void {
    this.userStatus = this.user?.status || 'Offline';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
