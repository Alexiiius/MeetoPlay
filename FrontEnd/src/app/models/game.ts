import { Gamemode } from "./gamemode";
import { Platform } from "./platform";

export class Game {
  id: number;
  name: string;
  image: string;


  constructor(
    id: number,
    name: string,
    image: string
  )
  {
    this.id = id;
    this.name = name;
    this.image = image;
  }
}
