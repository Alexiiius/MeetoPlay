import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
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

  @ViewChild (EventFormComponent) eventForm: EventFormComponent

  constructor(private authService: AuthService,
    private alert: AlertService
  ) {

  }

  openNewEventModal() {
    this.eventForm.openModal()
  }

  logout() {
    console.log('Login out')
    this.authService.logout()
  }

  testAlert() {
    this.alert.showAlert('success', 'This is a test alert')
  }

}
