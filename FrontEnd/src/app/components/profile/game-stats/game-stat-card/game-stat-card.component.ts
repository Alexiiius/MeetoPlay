import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { GameStat } from '../../../../interfaces/game-stat';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../services/api.service';
import { Gamemode } from '../../../../models/gamemode';
import { SelectGamemodeRankLvlComponent } from './select-gamemode-rank-lvl/select-gamemode-rank-lvl.component';
import { ProfileService } from '../../../../services/profile.service';
import { UserService } from '../../../../services/user.service';
import { GameStatFormComponent } from '../../game-stat-form/game-stat-form.component';
import { GamemodeStatsComponent } from './gamemode-stats/gamemode-stats.component';
import { GamemodeStat } from '../../../../interfaces/gamemode-stat';
import { NewFullGame } from '../../../../interfaces/new-fullGame';

@Component({
  selector: 'app-game-stat-card',
  standalone: true,
  imports: [
    CommonModule,
    SelectGamemodeRankLvlComponent,
    GamemodeStatsComponent,
    GameStatFormComponent,
  ],
  templateUrl: './game-stat-card.component.html',
  styleUrl: './game-stat-card.component.css'
})
export class GameStatCardComponent implements OnInit {

  @ViewChild(GameStatFormComponent) gameStatForm: GameStatFormComponent;

  @Input() gameStat: GameStat;
  isOpen: boolean = false;

  gamemodes: Gamemode[];
  fullGame: NewFullGame;

  apiService = inject(APIService);
  profileService = inject(ProfileService);

  gamemodeRankLvlComponents: {}[] = [];

  editingGamemodeStat: GamemodeStat;

  isDataLoading: boolean = true;

  ngOnInit(): void {
    this.getGamemodes();
    this.getFullGame();

    this.profileService.gamemodeStatCreated.subscribe(newGamemodeStat => {
      this.gameStat.gamemode_stats.push(newGamemodeStat);
    });

    this.profileService.gamemodeStatEdited.subscribe(editedGamemodeStat => {
      this.gameStat.gamemode_stats.push(editedGamemodeStat);
    });

    this.profileService.gamemodeStatEditCancelled.subscribe(() => {
      this.gameStat.gamemode_stats.push(this.editingGamemodeStat);
    });

    this.profileService.gamemodeStatDeleted.subscribe(gamemodeStatId => {
      this.gameStat.gamemode_stats = this.gameStat.gamemode_stats.filter(gamemodeStat => gamemodeStat.id !== gamemodeStatId);
    });
  }

  getFullGame() {
    this.isDataLoading = true;
    this.apiService.newGetFullGame(this.gameStat.game_id).subscribe(fullGame => {
      this.fullGame = fullGame;
      this.checkDataLoading();
    });
  }

  getGamemodes() {
    this.isDataLoading = true;
    this.apiService.newGetFullGame(this.gameStat.game_id).subscribe(game => {
      if (game) {
        this.gamemodes = game.gamemodes;
      }
      this.checkDataLoading();
    });
  }

  checkDataLoading() {
    if (this.fullGame && this.gamemodes) {
      this.isDataLoading = false;
    }
  }

  onGamemodeStatEditing(gamemodeStat: GamemodeStat) {
    // Guarda el gamemodeStat que se está editando en una variable temporal
    this.editingGamemodeStat = gamemodeStat;

    // Elimina el gamemodeStat que se está editando del array gameStat.gamemodesStats
    this.gameStat.gamemode_stats = this.gameStat.gamemode_stats.filter(stat => stat !== gamemodeStat);

    this.addGamemodeRankLvlComponentForEdit();
  }

  addGamemodeRankLvlComponentForEdit() {
    this.gamemodeRankLvlComponents.push(this.editingGamemodeStat);
  }

  addGamemodeRankLvlComponent(event: Event) {
    event.stopPropagation();
    this.gamemodeRankLvlComponents.push({});
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  deleteGamemodeRankLvlComponent(index: number) {
    this.gamemodeRankLvlComponents.splice(index, 1);
  }

  openEditGameStatForm() {
    this.gameStatForm.openModal();
  }
}
