import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {

  }

  logout() {
    console.log('Login out')
    this.authService.logout()
  }


}
