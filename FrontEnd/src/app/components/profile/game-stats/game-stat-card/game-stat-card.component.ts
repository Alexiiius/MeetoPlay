import { Component, Input } from '@angular/core';
import { GameStat } from '../../../../interfaces/game-stat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-stat-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './game-stat-card.component.html',
  styleUrl: './game-stat-card.component.css'
})
export class GameStatCardComponent {

  @Input() gameStat: GameStat;
  isOpen: boolean = false;

  constructor() { }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
