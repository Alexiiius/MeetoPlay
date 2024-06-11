import { GamemodeStat } from "./gamemode-stat";

export interface GameStat {
  id: number;
  game_id: number;
  user_id: number;
  game_name: string;
  hours_played: number;
  lv_account: number;
  nickname_game: string;
  game_pic: string;
  gamemode_stats: GamemodeStat[];
}
