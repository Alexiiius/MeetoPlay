export class EventRequirments {
  max_rank: string;
  min_rank: string;
  max_level: number;
  min_level: number;
  max_hours_played: number;
  min_hours_played: number;

  constructor(
    max_rank: string,
    min_rank: string,
    max_level: number,
    min_level: number,
    max_hours_played: number,
    min_hours_played: number
  ) {
    this.max_rank = max_rank;
    this.min_rank = min_rank;
    this.max_level = max_level;
    this.min_level = min_level;
    this.max_hours_played = max_hours_played;
    this.min_hours_played = min_hours_played;
  }
}
