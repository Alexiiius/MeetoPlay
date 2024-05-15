import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

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

  @Input() sizeClass: string;

  userStatus: String | 'Offline';
  private subscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe((user) => {
      if (user) {
        this.userStatus = user.status;
      } else {
        this.userStatus = 'Offline';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
