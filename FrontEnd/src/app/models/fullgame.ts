import { Gamemode } from "./gamemode";
import { Platform } from "./platform";

export class FullGame {
  game: {
    id: number;
    name: string;
    account_level_name: string;
    nickname_name: string[];
    description: string;
    image: string;
    platforms: Platform[];
    gamemodes: Gamemode[];
  }

  constructor(game: {
    id: number;
    name: string;
    account_level_name: string;
    nickname_name: string[];
    description: string;
    image: string;
    platforms: Platform[];
    gamemodes: Gamemode[];
  }) {
    this.game = game;
  }
}



