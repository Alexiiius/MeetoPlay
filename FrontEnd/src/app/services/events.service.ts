import { Injectable } from '@angular/core';
import { FormatedNewEvent } from '../interfaces/formated-new-event';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { backAPIUrl } from '../config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  YOUR_TOKEN = 'YOUR_TOKEN'
  private backAPIUrl = backAPIUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  postNewEvent(newEvent: any) {
    let formatedNewEvent = this.formatNewEvent(newEvent);
    console.log('Creating new event: ');
    console.log(formatedNewEvent);

    return this.http.post(this.backAPIUrl + '/create/event', formatedNewEvent);
  }

  getPublicEvents() {
    return this.http.get<any[]>(this.backAPIUrl + '/events/public');
  }

  getFriendsEvents() {
    return this.http.get<any[]>(this.backAPIUrl + '/events/friends');
  }

  getFollowingEvents() {
    return this.http.get<any[]>(this.backAPIUrl + '/events/following');
  }

  getHiddenEvents() {
    return this.http.get<any[]>(this.backAPIUrl + '/events/hidden');
  }

  getMyEvents() {
    return this.http.get<any[]>(this.backAPIUrl + '/events/my');
  }


  formatNewEvent(newEvent: any): FormatedNewEvent {

    const userId = this.authService.userData.value?.id;
    if (userId === undefined) {
      throw new Error('User data is not available');
    }

    let formatedNewEvent = {
      data: {
        event: {
          event_title: newEvent.whatForm.title,
          game_id: newEvent.whatForm.game.id,
          game_name: newEvent.whatForm.game.name,
          game_mode: newEvent.whatForm.gameMode.name,
          game_pic: newEvent.whatForm.game.image,
          platform: newEvent.whatForm.platform.platform,
          event_owner_id: this.authService.userData.value?.id || 0,
          date_time_begin: newEvent.whenForm.eventBegin,
          date_time_end: newEvent.whenForm.eventEnd,
          date_time_inscription_begin: newEvent.toggleInscription ? newEvent.whenForm.inscriptionBegin : null,
          date_time_inscription_end: newEvent.toggleInscription ? newEvent.whenForm.inscriptionEnd : null,
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
