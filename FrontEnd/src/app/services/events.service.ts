import { Injectable } from '@angular/core';
import { FormatedNewEvent } from '../interfaces/formated-new-event';
import { HttpClient } from '@angular/common/http';
import { backAPIUrl } from '../config';
import { UserService } from './user.service';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private backAPIUrl = backAPIUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  async postNewEvent(newEvent: any) {
    let formatedNewEvent = await this.formatNewEvent(newEvent);
    console.log('Creating new event: ');
    console.log(formatedNewEvent);

    return this.http.post(this.backAPIUrl + '/create/event', formatedNewEvent);
  }

  getPublicEvents(page: number) {
    return this.http.get<any[]>(`${this.backAPIUrl}/events/public/${page}`);
  }

  getFriendsEvents(page: number) {
    return this.http.get<any[]>(`${this.backAPIUrl}/events/friends/${page}`);
  }

  getFollowingEvents(page: number) {
    return this.http.get<any[]>(`${this.backAPIUrl}/events/following/${page}`);
  }

  getHiddenEvents(page: number) {
    return this.http.get<any[]>(`${this.backAPIUrl}/events/hidden/${page}`);
  }

  getMyEvents(page: number) {
    return this.http.get<any[]>(`${this.backAPIUrl}/events/my/${page}`);
  }

  joinEvent(eventId: number) {
    return this.http.post(`${this.backAPIUrl}/event/${eventId}/join`, {});
  }

  leaveEvent(eventId: number) {
    return this.http.post(`${this.backAPIUrl}/event/${eventId}/leave`, {});
  }

  async formatNewEvent(newEvent: any): Promise<FormatedNewEvent> {
    let user = await this.userService.currentUser.pipe(first()).toPromise();
    console.log(user);
    let userId = user?.id;

    let formatedNewEvent = {
      data: {
        event: {
          event_title: newEvent.whatForm.title,
          game_id: newEvent.whatForm.game.id,
          game_name: newEvent.whatForm.game.name,
          game_mode: newEvent.whatForm.gameMode.name,
          game_pic: newEvent.whatForm.game.image,
          platform: newEvent.whatForm.platform.platform,
          event_owner_id: userId || 0,
          date_time_begin: newEvent.whenForm.eventBegin,
          date_time_end: newEvent.whenForm.eventEnd,
          date_time_inscription_begin: newEvent.whenForm.inscriptionToggle ? newEvent.whenForm.inscriptionBegin : null,
          date_time_inscription_end: newEvent.whenForm.inscriptionToggle ? newEvent.whenForm.inscriptionEnd : null,
          max_participants: newEvent.whoForm.maxParticipants ? newEvent.whoForm.maxParticipants : 0,
          privacy: newEvent.whoForm.privacy,
        },
        event_requirements: {

          max_rank: newEvent.whoForm.toggleRequirments && newEvent.whoForm.rank ? newEvent.whoForm.maxRank : null,
          min_rank: newEvent.whoForm.toggleRequirments && newEvent.whoForm.rank ? newEvent.whoForm.minRank : null,

          max_level: newEvent.whoForm.toggleRequirments && newEvent.whoForm.level ? newEvent.whoForm.maxLevel : null,
          min_level: newEvent.whoForm.toggleRequirments && newEvent.whoForm.level ? newEvent.whoForm.minLevel : null,

          max_hours_played: newEvent.whoForm.toggleRequirments && newEvent.whoForm.hoursPlayed ? newEvent.whoForm.maxHours : null,
          min_hours_played: newEvent.whoForm.toggleRequirments && newEvent.whoForm.hoursPlayed ? newEvent.whoForm.minHours : null
        }
      }
    }
    return formatedNewEvent;
  }
}
