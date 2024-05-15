import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  constructor(private authService: AuthService) {

  }

  logout() {
    console.log('Login out')
    this.authService.logout()
  }

  click () {
    console.log('Click')
  }

}
