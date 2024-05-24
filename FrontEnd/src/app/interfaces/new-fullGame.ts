import { Gamemode } from "../models/gamemode";
import { Platform } from "../models/platform";

export interface NewFullGame {
  id: number;
  name: string;
  account_level_name: string;
  nickname_name: string[];
  description: string;
  image: string;
  platforms: Platform[];
  gamemodes: Gamemode[];
}
