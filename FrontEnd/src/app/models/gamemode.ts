export class Gamemode {
  id: number;
  name: string;
  description: string;
  ranked: boolean;
  max_players: number;
  min_players: number;
  ranks: string[];
  scenario_name: string[];
  game_id: number;

  constructor(id: number,
    name: string,
    description: string,
    ranked: boolean,
    max_players: number,
    min_players: number,
    ranks: string[],
    scenario_name: string[],
    game_id: number)
  {
      this.id = id;
      this.name = name;
      this.description = description;
      this.ranked = ranked;
      this.max_players = max_players;
      this.min_players = min_players;
      this.ranks = ranks;
      this.scenario_name = scenario_name;
      this.game_id = game_id;
  }
}
