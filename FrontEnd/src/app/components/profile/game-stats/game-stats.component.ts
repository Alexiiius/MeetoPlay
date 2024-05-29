import { Component, OnInit } from '@angular/core';
import { GameStatCardComponent } from './game-stat-card/game-stat-card.component';
import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { GameStat } from '../../../interfaces/game-stat';
import { CommonModule } from '@angular/common';
import { GameStatFormComponent } from '../game-stat-form/game-stat-form.component';
import { merge, of, switchMap, tap } from 'rxjs';

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

  stats: GameStat[];
  isLoading: boolean;
  currentProfileId: number | null = null;

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    merge(
      this.profileService.getUserProfileId().pipe(tap(() => this.isLoading = true)),
      this.profileService.gameStatCreated
    ).pipe(
      switchMap(id => {
        if (id !== null && id !== undefined) {
          this.currentProfileId = id;
        }
        if (this.currentProfileId !== null) {
          return this.userService.getUserGameStats(this.currentProfileId);
        } else {
          return of(null);
        }
      })
    ).subscribe(response => {
      if (response) {
        this.stats = response.data.GameUserStats;
        console.log(this.stats);
      }
      this.isLoading = false;
    });
  }
}
