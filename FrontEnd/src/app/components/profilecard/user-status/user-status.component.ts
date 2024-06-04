import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserData } from '../../../interfaces/user-data';
import { UserService } from '../../../services/user.service';

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

  @Input() user: UserData | null = null;
  @Input() isLoading: boolean;
  @Input() sizeClass: string;

  userStatus: String;
  private subscription: Subscription;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscription = this.userService.userStatusChanged.subscribe(
      (newStatus: string) => {
        this.userStatus = newStatus;
      }
    );
  }

  ngOnChanges(): void {
    this.userStatus = this.user?.status || 'Offline';
    console.log('User status: ', this.userStatus);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
