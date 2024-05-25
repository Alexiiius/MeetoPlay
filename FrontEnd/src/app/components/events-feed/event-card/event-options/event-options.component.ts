import { Component, Input, ViewChild } from '@angular/core';
import { Event } from '../../../../models/event';
import { EventFormComponent } from '../../../event-form/event-form.component';
import { EventsService } from '../../../../services/events.service';

@Component({
  selector: 'app-event-options',
  standalone: true,
  imports: [
    EventFormComponent
  ],
  templateUrl: './event-options.component.html',
  styleUrl: './event-options.component.css'
})
export class EventOptionsComponent {

  constructor(private eventService: EventsService) {}

  @Input() event: Event;

  @ViewChild(EventFormComponent) eventFormComponent!: EventFormComponent;

  openEditModal() {
    this.eventFormComponent.openModal();
  }

  closeEditModal() {
    this.eventFormComponent.closeModal();
  }

  deleteEvent() {
    this.eventService.deleteEvent(this.event.id);
  }
}
