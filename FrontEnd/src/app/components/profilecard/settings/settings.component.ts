import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(private authService: AuthService) { }

  isLoggingOut = false;

  logout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe(
      () => this.isLoggingOut = false,
      error => {
        console.log(error);
        this.isLoggingOut = false;
      }
    );
  }
}
