import { EventRequirments } from "./eventRequirments";

export class Event {
  id: number;
  event_title: string;
  game_id: number;
  game_name: string;
  game_mode: string;
  game_pic: string;
  platform: string;
  event_owner_id: number;
  date_time_begin: Date;
  date_time_end: Date;
  date_time_inscription_begin: Date;
  date_time_inscription_end: Date;
  max_participants: number;
  privacy: string;
  event_requirements: EventRequirments;

  constructor(
    id: number,
    event_title: string,
    game_id: number,
    game_name: string,
    game_mode: string,
    game_pic: string,
    platform: string,
    event_owner_id: number,
    date_time_begin: Date,
    date_time_end: Date,
    date_time_inscription_begin: Date,
    date_time_inscription_end: Date,
    max_participants: number,
    privacy: string,
    event_requirements: EventRequirments
  ) {
    this.id = id;
    this.event_title = event_title;
    this.game_id = game_id;
    this.game_name = game_name;
    this.game_mode = game_mode;
    this.game_pic = game_pic;
    this.platform = platform;
    this.event_owner_id = event_owner_id;
    this.date_time_begin = date_time_begin;
    this.date_time_end = date_time_end;
    this.date_time_inscription_begin = date_time_inscription_begin;
    this.date_time_inscription_end = date_time_inscription_end;
    this.max_participants = max_participants;
    this.privacy = privacy;
    this.event_requirements = event_requirements;
  }
}
