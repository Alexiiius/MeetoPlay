import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class UserStatusComponent {
  userStatus: String;

  constructor(private userService: UserService) {
    this.userService.currentUser.subscribe(userData => {
      this.userStatus = userData.status;
    });
  }

}
