import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from './event-card/event-card.component';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { EventRequirments } from '../../models/eventRequirments';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    EventCardComponent,
    NavBarComponent
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsFeedComponent implements OnInit {

  publicEvents: Event[];
  friendsEvents: Event[];
  followingEvents: Event[];
  hiddenEvents: Event[];
  myEvents: Event[];

  constructor(private eventService: EventsService) { }

  ngOnInit() {
    this.getPublicEvents(1);
    this.getFriendsEvents(1);
    // this.getFollowingEvents(1);

    console.log('EventsFeedComponent initialized')
  }

  getPublicEvents(page: number) {
    this.eventService.getPublicEvents(page).subscribe((response: any) => {
      this.publicEvents = response.data.events.map((event: Event) => this.transformToEvent(event));
      console.log('Public events: ', this.publicEvents);
    });
  }

  getFriendsEvents(page: number) {
    this.eventService.getFriendsEvents(page).subscribe((response: any) => {
      this.friendsEvents = response.data.events.map((event: Event) => this.transformToEvent(event));
      console.log('Friends events: ', this.friendsEvents);
    });
  }

  getFollowingEvents(page: number) {
    this.eventService.getFollowingEvents(page).subscribe((response: any) => {
      this.followingEvents = response.data.events.map((event: Event) => this.transformToEvent(event));
      console.log('Following events: ', this.followingEvents);
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
