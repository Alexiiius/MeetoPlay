import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { Event } from '../../../../models/event';
import { EventFormComponent } from '../../../event-form/event-form.component';
import { EventsService } from '../../../../services/events.service';
import { ProfileService } from '../../../../services/profile.service';

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

  deletingEvent: boolean = false;

  constructor(private eventService: EventsService) {}

  profileService = inject(ProfileService);

  @Input() event: Event;

  @ViewChild(EventFormComponent) eventFormComponent!: EventFormComponent;
  @ViewChild('deleteEventModal') deleteEventModal: ElementRef<HTMLDialogElement>;


  openEditModal() {
    this.eventFormComponent.openModal();
  }

  closeEditModal() {
    this.eventFormComponent.closeModal();
  }

  openDeleteModal() {
    this.deleteEventModal.nativeElement.showModal();
  }

  closeDeleteModal() {
    this.deleteEventModal.nativeElement.close();
  }

  deleteEvent() {
    this.deletingEvent = true;
    this.eventService.deleteEvent(this.event.id).subscribe(
      (response) => {
        this.deletingEvent = false;
        console.log('Response:', response);
        this.profileService.eventDeleted.next();
        this.closeDeleteModal();
      },
      (error) => {
        console.error('Error:', error);
      });
  }
}
