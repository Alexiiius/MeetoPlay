import { Component, inject, Input, OnInit } from '@angular/core';
import { GameStat } from '../../../../interfaces/game-stat';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../services/api.service';
import { Gamemode } from '../../../../models/gamemode';
import { SelectGamemodeRankLvlComponent } from '../../select-gamemode-rank-lvl/select-gamemode-rank-lvl.component';

@Component({
  selector: 'app-game-stat-card',
  standalone: true,
  imports: [
    CommonModule,
    SelectGamemodeRankLvlComponent
  ],
  templateUrl: './game-stat-card.component.html',
  styleUrl: './game-stat-card.component.css'
})
export class GameStatCardComponent implements OnInit {

  @Input() gameStat: GameStat;
  isOpen: boolean = false;

  gamemodes: Gamemode[];

  apiService = inject(APIService);

  gamemodeRankLvlComponents:{}[] = [];

  addGamemodeRankLvlComponent(event: Event) {
    event.stopPropagation();
    this.gamemodeRankLvlComponents.push({});
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    this.getGamemodes();
  }

  deleteGamemodeRankLvlComponent(index: number) {
    this.gamemodeRankLvlComponents.splice(index, 1);
  }

  getGamemodes() {
    this.apiService.newGetFullGame(this.gameStat.game_id).subscribe(game => {
      if (game) {
        this.gamemodes = game.gamemodes;
      }
      console.log(this.gamemodes);
    });
  }
}
