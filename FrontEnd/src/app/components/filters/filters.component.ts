import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MoreEventInfoModalComponent } from '../events-feed/event-card/more-event-info-modal/more-event-info-modal.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    RouterLink,
    MoreEventInfoModalComponent
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


}
