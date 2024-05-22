import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from '../../events-feed/event-card/event-card.component';
import { UserReduced } from '../../../interfaces/user-reduced';
import { EventRequirments } from '../../../models/eventRequirments';
import { Owner } from '../../../models/owner';
import { Event } from '../../../models/event';
import { EventsService } from '../../../services/events.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [
    EventCardComponent,
    CommonModule,
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

  constructor(private eventService: EventsService) { }

  ngOnInit(): void {
    this.getMyEvents(this.page);
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
      const newEvents = response.data.events.map((event: any) => this.transformToEvent(event));
      this.myEvents = [...this.myEvents, ...newEvents];

      this.totalPages = response.meta.total_pages;
      this.hasMoreEvents = this.page < this.totalPages;
      this.isLoading = false;
    });
  }

  transformToEvent(apiResponse: any): Event {
    const eventRequirments = new EventRequirments(
      apiResponse.event_requirements.max_rank,
      apiResponse.event_requirements.min_rank,
      apiResponse.event_requirements.max_level,
      apiResponse.event_requirements.min_level,
      apiResponse.event_requirements.max_hours_played,
      apiResponse.event_requirements.min_hours_played
    );

    const owner = new Owner(
      apiResponse.owner.id,
      apiResponse.owner.tag,
      apiResponse.owner.name,
      apiResponse.owner.avatar
    );

    const participants = apiResponse.participants.map((participant: any) => {
      return {
        id: participant.id,
        name: participant.name,
        tag: participant.tag,
        avatar: participant.avatar,
        status: participant.status
      } as UserReduced;

    }); return new Event(
      apiResponse.id,
      apiResponse.event_title,
      apiResponse.game_id,
      apiResponse.game_name,
      apiResponse.game_mode,
      apiResponse.game_pic,
      apiResponse.platform,
      apiResponse.event_owner_id,
      apiResponse.date_time_begin,
      apiResponse.date_time_end,
      apiResponse.date_time_inscription_begin,
      apiResponse.date_time_inscription_end,
      apiResponse.max_participants,
      apiResponse.privacy,
      eventRequirments,
      owner,
      participants
    );
  }
}
