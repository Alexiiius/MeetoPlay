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
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { UserData } from '../../../../interfaces/user-data';

@Component({
  selector: 'app-game-stat-card',
  standalone: true,
  imports: [
    CommonModule,
    SelectGamemodeRankLvlComponent,
    GamemodeStatsComponent,
    GameStatFormComponent,
    FormsModule
  ],
  templateUrl: './game-stat-card.component.html',
  styleUrl: './game-stat-card.component.css'
})
export class GameStatCardComponent implements OnInit {

  @ViewChild(GameStatFormComponent) gameStatForm: GameStatFormComponent;

  logedUser: UserData;
  profileId: number | null = null;

  @Input() gameStat: GameStat;
  isOpen: boolean = false;

  gamemodes: Gamemode[];
  fullGame: NewFullGame;

  apiService = inject(APIService);
  profileService = inject(ProfileService);
  userService = inject(UserService);
  alertService = inject(AlertService);

  gamemodeRankLvlComponents: {}[] = [];

  editingGamemodeStat: GamemodeStat;

  isDataLoading: boolean = true;
  isDeleting: boolean = false;

  defaultGamemodeStat: GamemodeStat = {
    id: -1,
    game_user_stats_id: -1,
    gamemode_name: 'deafult',
    gamemodes_rank: '',
  }

  ngOnInit(): void {
    this.getGamemodes();
    this.getFullGame();

    this.userService.currentUser.subscribe(user => {
      if(user){
        this.logedUser = user;
      }
    });

    this.profileService.getUserProfileId().subscribe(id => {
      this.profileId = id;
    });

    this.profileService.gamemodeStatCreated.subscribe(newGamemodeStat => {
      console.log(newGamemodeStat);
      if (!this.gameStat.gamemode_stats) {
        this.gameStat.gamemode_stats = [];
      }
      this.gameStat.gamemode_stats.push(newGamemodeStat);
    });

    this.profileService.gamemodeStatEdited.subscribe(editedGamemodeStat => {
      this.gameStat.gamemode_stats.push(editedGamemodeStat);
      this.editingGamemodeStat = this.defaultGamemodeStat;
    });

    this.profileService.gamemodeStatEditCancelled.subscribe(restoredGamemodeStat => {
      this.gameStat.gamemode_stats.push(restoredGamemodeStat);
      this.editingGamemodeStat = this.defaultGamemodeStat;
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
    this.gamemodeRankLvlComponents.push({});
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

  deleteGamemodeStat() {
    this.isDeleting = true;
    this.userService.deleteGameStat(this.gameStat.id).subscribe( () => {
      this.isDeleting = false;
      this.profileService.gameStatDeleted.next(this.gameStat.id);
    });
  }
}
