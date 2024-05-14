import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ExtraComponent } from './extra/extra.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { UserData } from '../../interfaces/user-data';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profilecard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SettingsComponent,
    ExtraComponent,
    UserStatusComponent
  ],
  templateUrl: './profilecard.component.html',
  styleUrl: './profilecard.component.css'
})
export class ProfilecardComponent {

  isLoggingOut = false;
  user: UserData;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => this.user = user);
  }
}
