import { Component, OnInit } from '@angular/core';
import { GameStatCardComponent } from './game-stat-card/game-stat-card.component';
import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { GameStat } from '../../../interfaces/game-stat';
import { CommonModule } from '@angular/common';
import { GameStatFormComponent } from '../game-stat-form/game-stat-form.component';

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

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.profileService.getUserProfileId().subscribe(id => {
      this.isLoading = true;
      if (id !== null) {
        this.userService.getUserGameStats(id).subscribe(response => {
          this.stats = response.data.GameUserStats;
          console.log(this.stats);
          this.isLoading = false;
        });
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
}
