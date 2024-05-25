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

  constructor(private http: HttpClient) { }

  postNewEvent(newEvent: any) {
    return this.http.post(this.backAPIUrl + '/create/event', newEvent);
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

  getSearchedEvents(page: number, search: string) {
    return this.http.get<any[]>(`${this.backAPIUrl}/events/search/${search}/${page}`);
  }

  joinEvent(eventId: number) {
    return this.http.post(`${this.backAPIUrl}/event/${eventId}/join`, {});
  }

  leaveEvent(eventId: number) {
    return this.http.post(`${this.backAPIUrl}/event/${eventId}/leave`, {});
  }
}
