import { Injectable } from '@angular/core';
import { FormatedNewEvent } from '../interfaces/formated-new-event';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor() { }

  postNewEvent(newEvent: any) {
    let formatedNewEvent = this.formatNewEvent(newEvent);
    console.log('Enviando evento al back-end');
    console.log(formatedNewEvent);
  }

  formatNewEvent(newEvent: any): FormatedNewEvent {

    let formatedNewEvent = {
      data: {
        event: {
          event_title: newEvent.whatForm.title,
          game_id: newEvent.whatForm.game.id,
          game_name: newEvent.whatForm.game.name,
          game_mode: newEvent.whatForm.gameMode.name,
          game_pic: newEvent.whatForm.game.image,
          platform: newEvent.whatForm.platform.name,
          event_owner_id: 1, //TODO: Cambiar por el id del usuario logueado
          date_time_begin: newEvent.whenForm.eventBegin,
          date_time_end: newEvent.whenForm.eventEnd,
          date_time_inscription_begin: newEvent.toggleInscription ? newEvent.whenForm.inscriptionBegin : null,
          date_time_inscription_end: newEvent.toggleInscription ? newEvent.whenForm.inscriptionEnd : null,
          max_participants: newEvent.whoForm.maxParticipants,
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
