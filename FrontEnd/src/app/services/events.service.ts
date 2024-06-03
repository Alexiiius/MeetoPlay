import { Injectable } from '@angular/core';
import { FormatedNewEvent } from '../interfaces/formated-new-event';
import { HttpClient } from '@angular/common/http';
import { backAPIUrl } from '../config';
import { UserService } from './user.service';
import { first, Observable, Subject } from 'rxjs';
import { UserReduced } from '../interfaces/user-reduced';
import { Owner } from '../models/owner';
import { EventRequirments } from '../models/eventRequirments';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private backAPIUrl = backAPIUrl;

  constructor(private http: HttpClient) { }

  postNewEvent(newEvent: any) {
    return this.http.post(this.backAPIUrl + '/event/create', newEvent);
  }

  updateEvent(eventId: number, updatedEvent: any) {
    return this.http.put(this.backAPIUrl + '/event/update/' + eventId, updatedEvent);
  }

  deleteEvent(eventId: number) {
    return this.http.delete(this.backAPIUrl + '/event/delete/' + eventId);
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

  getParticipatingEvents(page: number) {
    return this.http.get<any[]>(`${this.backAPIUrl}/events/participating/${page}`);
  }

  getSearchedEvents(page: number, group: string, search: string): Observable<{data: {events: any[]}}> {
    console.log(`${this.backAPIUrl}/events/search/${search}/${group}/${page}`);
    return this.http.get<{data: {events: any[]}}>(`${this.backAPIUrl}/events/search/${search}/${group}/${page}`);
  }

  joinEvent(eventId: number) {
    return this.http.post(`${this.backAPIUrl}/event/${eventId}/join`, {});
  }

  leaveEvent(eventId: number) {
    return this.http.post(`${this.backAPIUrl}/event/${eventId}/leave`, {});
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
