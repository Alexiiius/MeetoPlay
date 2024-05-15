import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventCardComponent } from './event-card/event-card.component';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { EventRequirments } from '../../models/eventRequirments';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { EventFeedService } from '../../services/event-feed.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    EventCardComponent,
    NavBarComponent,
    CommonModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsFeedComponent implements OnInit {

  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  displayedEvents: Event[] = [];

  publicEvents: Event[] = [];
  friendsEvents: Event[] = [];
  followingEvents: Event[] = [];

  publicPage = 1;
  publicTotalPages = 1;
  friendsPage = 1;
  friendsTotalPages = 1;
  followingPage = 1;
  followingTotalPages = 1;

  isLoading = false;
  hasMoreEvents = false;

  constructor(private eventService: EventsService, private eventFeedService: EventFeedService) { }

  ngOnInit() {
    this.getPublicEvents(this.publicPage);
    this.getFriendsEvents(this.friendsPage);
    //this.getFriendsEvents(this.followingPage);

    this.eventFeedService.currentGroup.subscribe(group => {
      switch(group) {
        case 'Public':
          this.displayedEvents = this.publicEvents;
          this.hasMoreEvents = this.publicPage < this.publicTotalPages;
          break;
        case 'Friends':
          this.displayedEvents = this.friendsEvents;
          this.hasMoreEvents = this.friendsPage < this.friendsTotalPages;
          break;
        case 'Follows':
          this.hasMoreEvents = this.followingPage < this.followingTotalPages;
          //this.displayedEvents = this.followingEvents;
          break;
        default:
          console.error(`Unexpected group: ${group}`);
      }
    });
  }

  loadMoreEvents() {
    this.eventFeedService.currentGroup.subscribe(group => {
      switch(group) {
        case 'Public':
          if (this.publicPage < this.publicTotalPages) {
            this.getPublicEvents(++this.publicPage);
          }
          break;
        case 'Friends':
          if (this.friendsPage < this.friendsTotalPages) {
            this.getFriendsEvents(++this.friendsPage);
          }
          break;
        case 'Follows':
          if (this.followingPage < this.followingTotalPages) {
            this.getFollowingEvents(++this.followingPage);
          }
          break;
        default:
          console.error(`Unexpected group: ${group}`);
      }
    });
  }

  getPublicEvents(page: number) {
    this.isLoading = true;

    this.eventService.getPublicEvents(page).subscribe((response: any) => {
      const newEvents = response.data.events.map((event: Event) => this.transformToEvent(event));
      this.publicEvents = [...this.publicEvents, ...newEvents];
      this.publicTotalPages = response.meta.total_pages;
      this.hasMoreEvents = this.publicPage < this.publicTotalPages;

      this.displayedEvents = this.publicEvents;

      this.isLoading = false;
      console.log('Public events: ', this.publicEvents);
    }, error => {
      console.error('Error fetching public events: ', error)
      this.isLoading = false;
    });
  }

  getFriendsEvents(page: number) {
    this.isLoading = true;

    this.eventService.getFriendsEvents(page).subscribe((response: any) => {
      const newEvents = response.data.events.map((event: Event) => this.transformToEvent(event));
      this.friendsEvents = [...this.friendsEvents, ...newEvents];
      this.friendsTotalPages = response.meta.total_pages;
      this.hasMoreEvents = this.publicPage < this.publicTotalPages;

      this.isLoading = false;
      console.log('Friends events: ', this.friendsEvents);
    }, error => {
      console.error('Error fetching friends events: ', error)
      this.isLoading = false;
    });
  }

  getFollowingEvents(page: number) {
    this.isLoading = true;

    this.eventService.getFollowingEvents(page).subscribe((response: any) => {
      const newEvents = response.data.events.map((event: Event) => this.transformToEvent(event));
      this.followingEvents = [...this.followingEvents, ...newEvents];
      this.followingTotalPages = response.meta.total_pages;
      this.hasMoreEvents = this.publicPage < this.publicTotalPages;

      this.isLoading = false;
      console.log('Following events: ', this.followingEvents);
    }, error => {
      console.error('Error fetching following events: ', error)
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
