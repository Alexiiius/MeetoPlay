import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from './event-card/event-card.component';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { EventRequirments } from '../../models/eventRequirments';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    EventCardComponent
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsFeedComponent{

  publicEvents: Event[];
  friendsEvents: Event[];
  followingEvents: Event[];
  hiddenEvents: Event[];
  myEvents: Event[];

  constructor(private eventService: EventsService) { }

  getPublicEvents() {
    this.eventService.getPublicEvents().subscribe((events: any[]) => {
      this.publicEvents = events.map(event => this.transformToEvent(event));
    });
  }

  getFriendsEvents() {
    this.eventService.getFriendsEvents().subscribe((events: any[]) => {
      this.friendsEvents = events.map(event => this.transformToEvent(event));
    });
  }

  getFollowingEvents() {
    this.eventService.getFollowingEvents().subscribe((events: any[]) => {
      this.followingEvents = events.map(event => this.transformToEvent(event));
    });
  }

  getHiddenEvents() {
    this.eventService.getHiddenEvents().subscribe((events: any[]) => {
      this.hiddenEvents = events.map(event => this.transformToEvent(event));
    });
  }

  getMyEvents() {
    this.eventService.getMyEvents().subscribe((events: any[]) => {
      this.myEvents = events.map(event => this.transformToEvent(event));
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
    return new Event(
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
      eventRequirments
    );
  }
}
