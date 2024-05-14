import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-extra-user-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-extra-status.component.html',
  styleUrl: './user-extra-status.component.css'
})
export class UserExtraStatusComponent {
  userStatus: String;

  constructor(private userService: UserService) {
    this.userService.currentUser.subscribe(userData => {
      this.userStatus = userData.status;
    });
  }

}
