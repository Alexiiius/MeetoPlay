import { Component } from '@angular/core';
import { EventsService } from '../../../services/events.service';
import { Event } from '../../../models/event';
import { EventCardComponent } from '../../events-feed/event-card/event-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participating-events',
  standalone: true,
  imports: [
    EventCardComponent,
    CommonModule,
  ],
  templateUrl: './participating-events.component.html',
  styleUrl: './participating-events.component.css'
})
export class ParticipatingEventsComponent {

  participatingEvents: Event[] = [];

  page: number = 1;
  totalPages: number = 1;

  isLoading: boolean = false;
  hasMoreEvents: boolean = false;
  moreEventsLoaded: boolean = false;

  constructor(private eventService: EventsService) { }

  ngOnInit(): void {
    this.getParticipatingEvents(this.page);
  }

  loadMoreEvents(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getParticipatingEvents(this.page);
      this.moreEventsLoaded = true;
    }
  }

  getParticipatingEvents(page: number): void {
    this.isLoading = true;

    this.eventService.getParticipatingEvents(page).subscribe((response: any) => {
      const newEvents = response.data.events.map((event: any) => this.eventService.transformToEvent(event));
      this.participatingEvents = [...this.participatingEvents, ...newEvents];

      this.totalPages = response.meta.total_pages;
      this.hasMoreEvents = this.page < this.totalPages;
      this.isLoading = false;
    });
  }
}
