import { Component, OnInit, ViewChild } from '@angular/core';
import { GameStatCardComponent } from './game-stat-card/game-stat-card.component';
import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { GameStat } from '../../../interfaces/game-stat';
import { CommonModule } from '@angular/common';
import { GameStatFormComponent } from '../game-stat-form/game-stat-form.component';
import { UserData } from '../../../interfaces/user-data';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [
    GameStatCardComponent,
    CommonModule,
    GameStatFormComponent
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class GameStatsComponent implements OnInit {

  stats: GameStat[] = [];
  isLoading: boolean = true;

  profileId: number | null = null;
  logedUser: UserData;

  @ViewChild(GameStatFormComponent) gameStatFormComponent!: GameStatFormComponent;

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.profileService.getUserProfileId().subscribe(id => {
      this.isLoading = true;
      this.profileId = id;
      if (id !== null) {
        this.userService.getUserGameStats(id).subscribe(response => {
          this.stats = response.data.GameUserStats;
          this.isLoading = false;
        });
      }
    });

    this.userService.currentUser.subscribe(user => {
      if(user){
        this.logedUser = user;
      }
    });

    this.profileService.gameStatCreated.subscribe(newGameStat => {
      console.log(newGameStat);
      this.stats.push(newGameStat);
    });

    this.profileService.gameStatEdited.subscribe(editedGameStat => {
      const index = this.stats.findIndex(stat => stat.id === editedGameStat.id);
      this.stats[index] = editedGameStat;
    });

    this.profileService.gameStatDeleted.subscribe(id => {
      const index = this.stats.findIndex(stat => stat.id === id);
      this.stats.splice(index, 1);
    });
  }

  openGameStatFormModal() {
    this.gameStatFormComponent.openModal();
  }
}
