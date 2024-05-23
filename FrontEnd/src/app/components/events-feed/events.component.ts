import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventCardComponent } from './event-card/event-card.component';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { EventRequirments } from '../../models/eventRequirments';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { EventFeedService } from '../../services/event-feed.service';
import { CommonModule } from '@angular/common';
import { Owner } from '../../models/owner';
import { UserReduced } from '../../interfaces/user-reduced';
import { SocialUser } from '../../interfaces/social-user';
import { UserService } from '../../services/user.service';
import { FollowedUsersResponse } from '../../interfaces/followed-user-response';
import { FriendsResponse } from '../../interfaces/friends-response';
import { take } from 'rxjs';

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

  actualGroup: 'Public' | 'Friends' | 'Followed' | string;

  hasMoreEvents: { [K in typeof this.actualGroup]: boolean } = {
    'Public': false,
    'Friends': false,
    'Followed': false
  };

  moreEventsLoaded: { [K in typeof this.actualGroup]: boolean } = {
    'Public': false,
    'Friends': false,
    'Followed': false
  };

  followedUsers: SocialUser[];
  friends: SocialUser[];

  constructor(
    private eventService: EventsService,
    private eventFeedService: EventFeedService,
    private userService: UserService) { }

  ngAfterViewInit() {
    this.eventFeedService.currentGroup.subscribe(group => {
      this.smoothScrollToTop();
      this.actualGroup = group;
      switch (group) {
        case 'Public':
          this.displayedEvents = this.publicEvents;
          this.hasMoreEvents['Public'] = this.publicPage < this.publicTotalPages;
          break;
        case 'Friends':
          this.displayedEvents = this.friendsEvents;
          this.hasMoreEvents['Friends'] = this.friendsPage < this.friendsTotalPages;
          break;
        case 'Followed':
          this.hasMoreEvents['Followed'] = this.followingPage < this.followingTotalPages;
          this.displayedEvents = this.followingEvents;
          break;
        default:
          console.error(`Unexpected group: ${group}`);
      }
    });
  }

  ngOnInit() {
    this.getPublicEvents(this.publicPage);
    this.getFriendsEvents(this.friendsPage);
    this.getFollowingEvents(this.followingPage);
    this.getFollowedUsers();
    this.getFriends();
  }

  showMoreEventsBtn(): boolean {
    return this.hasMoreEvents[this.actualGroup];
  }


  showScrolltoTopBtn(): boolean {
    return this.moreEventsLoaded[this.actualGroup];
  }

  getFollowedUsers(): void {
    this.userService.getFollowedUsers().subscribe(
      (response: FollowedUsersResponse) => {
        this.followedUsers = response.data.following;
        this.userService.updateFollowedUsers(this.followedUsers);

        // console.log('Followed users: ', this.followedUsers);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  getFriends(): void {
    this.userService.getFriends().subscribe(
      (response: FriendsResponse) => {
        this.friends = response.data.friends;
        this.userService.updateFriends(this.friends);

        // console.log('Friends: ', this.friends);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  //Animación de scroll
  startPosition: number;
  elapsedTime: number;
  duration: number = 500; // Duración del desplazamiento

  easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  smoothScrollToTop() {
    this.startPosition = this.scrollContainer.nativeElement.scrollTop;
    this.elapsedTime = 0;

    const animation = (timestamp: number) => {
      if (!this.elapsedTime) {
        this.elapsedTime = timestamp;
      }

      const time = timestamp - this.elapsedTime;
      const t = time / this.duration;

      if (t < 1) {
        requestAnimationFrame(animation);
      }

      this.scrollContainer.nativeElement.scrollTop = this.startPosition * (1 - this.easeInOutCubic(t));
    }

    requestAnimationFrame(animation);
  }

  loadMoreEvents() {
    this.eventFeedService.currentGroup.pipe(take(1)).subscribe(group => {
      switch (group) {
        case 'Public':
          if (this.publicPage < this.publicTotalPages) {
            this.getPublicEvents(++this.publicPage);
            this.moreEventsLoaded['Public'] = true;
          }
          break;
        case 'Friends':
          if (this.friendsPage < this.friendsTotalPages) {
            this.getFriendsEvents(++this.friendsPage);
            this.moreEventsLoaded['Friends'] = true;
          }
          break;
        case 'Followed':
          if (this.followingPage < this.followingTotalPages) {
            this.getFollowingEvents(++this.followingPage);
            this.moreEventsLoaded['Followed'] = true;
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
      this.hasMoreEvents['Public'] = this.publicPage < this.publicTotalPages;

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
      this.hasMoreEvents['Friends'] = this.friendsPage < this.friendsTotalPages;

      if (page < 1) {
        this.displayedEvents = this.friendsEvents;
      }

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
      this.hasMoreEvents['Followed'] = this.followingPage < this.followingTotalPages;

      if (page < 1) {
        this.displayedEvents = this.followingEvents;
      }

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
