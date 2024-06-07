import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { EventCardComponent } from '../../events-feed/event-card/event-card.component';

import { Event } from '../../../models/event';
import { EventsService } from '../../../services/events.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { merge } from 'rxjs';
import { UserData } from '../../../interfaces/user-data';
import { UserService } from '../../../services/user.service';
import { EventFormComponent } from '../../event-form/event-form.component';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [
    EventCardComponent,
    CommonModule,
    EventFormComponent
  ],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {

  myEvents: Event[] = [];

  page: number = 1;
  totalPages: number = 1;

  isLoading: boolean = false;
  hasMoreEvents: boolean = false;
  moreEventsLoaded: boolean = false;

  logedUser: UserData;

  constructor(private eventService: EventsService) { }

  profileService = inject(ProfileService);
  userService = inject(UserService);

  ngOnInit(): void {
    this.getMyEvents(this.page);

    merge(
      this.profileService.eventDeleted,
      this.profileService.eventEdited,
      this.profileService.eventCreated
    ).subscribe(() => {
      this.getMyEvents(this.page);
      this.myEvents = []
    });
  }

  @ViewChild(EventFormComponent) eventFormComponent!: EventFormComponent;

  openNewEventModal() {
    this.eventFormComponent.openModal()
  }

  loadMoreEvents(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getMyEvents(this.page);
      this.moreEventsLoaded = true;
    }
  }

  getMyEvents(page: number): void {
    this.isLoading = true;

    this.eventService.getMyEvents(page).subscribe((response: any) => {
      const newEvents = response.data.events.map((event: any) => this.eventService.transformToEvent(event));
      this.myEvents = [...this.myEvents, ...newEvents];

      this.totalPages = response.meta.total_pages;
      this.hasMoreEvents = this.page < this.totalPages;
      this.isLoading = false;
    });
  }
}
