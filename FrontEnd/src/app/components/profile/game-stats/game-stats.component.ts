import { Component, OnInit } from '@angular/core';
import { GameStatCardComponent } from './game-stat-card/game-stat-card.component';
import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { Game } from '../../../models/game';
import { GameStat } from '../../../interfaces/game-stat';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [
    GameStatCardComponent
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class GameStatsComponent implements OnInit {

  stats: GameStat[] = [];
  isLoading = true;

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.profileService.getUserProfileId().subscribe(id => {
      if (id !== null) {
        this.userService.getUserGameStats(id).subscribe(response => {
          this.stats = response.data.GameUserStats;
          console.log(this.stats);
          this.isLoading = false;
        });
      }
    });
  }
}
