import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MoreEventInfoModalComponent } from '../events-feed/event-card/more-event-info-modal/more-event-info-modal.component';
import { AlertService } from '../../services/alert.service';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    RouterLink,
    EventFormComponent
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  constructor(private authService: AuthService,
    private alert: AlertService
  ) {

  }

  logout() {
    console.log('Login out')
    this.authService.logout()
  }

  testAlert() {
    this.alert.showAlert('success', 'This is a test alert')
  }

}
