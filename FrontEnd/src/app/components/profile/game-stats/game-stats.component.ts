import { Component } from '@angular/core';
import { GameStatCardComponent } from './game-stat-card/game-stat-card.component';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [
    GameStatCardComponent
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {

}
