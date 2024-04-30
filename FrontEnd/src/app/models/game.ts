import { Gamemode } from "./gamemode";

export class Game {
  id: number;
  name: string;
  account_level_name: string;
  nickname_name: string[];
  description: string;
  image: string;
  gamemodes: Gamemode[];


  constructor(
    id: number,
    name: string,
    image: string,
    account_level_name: string = '',
    nickname_name: string[] = [],
    description: string = '',
    gamemodes: Gamemode[] = [])
  {
    this.id = id;
    this.name = name;
    this.account_level_name = account_level_name;
    this.nickname_name = nickname_name;
    this.description = description;
    this.image = image;
    this.gamemodes = gamemodes;
  }
}
