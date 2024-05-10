export interface FormatedNewEvent {
  data: {
    event: {
      event_title: string;
      game_id: number;
      game_name: string;
      game_mode: string;
      game_pic: string;
      platform: string;
      event_owner_id: number;
      date_time_begin: string;
      date_time_end: string;
      date_time_inscription_begin: string | null;
      date_time_inscription_end: string | null;
      max_participants: number,
      privacy: string
    },
    event_requirements: {
      max_rank: number | null;
      min_rank: number | null;
      max_level: number | null;
      min_level: number | null;
      max_hours_played: number | null;
      min_hours_played: number | null;
    }
  }
}
