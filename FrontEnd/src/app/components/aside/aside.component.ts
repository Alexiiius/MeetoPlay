import { Component, ViewChild } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';
import { UsersSearcherComponent } from './users-searcher/users-searcher.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    UsersSearcherComponent
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

  @ViewChild (EventFormComponent) eventForm: EventFormComponent


  openNewEventModal() {
    this.eventForm.openModal()
  }
}
