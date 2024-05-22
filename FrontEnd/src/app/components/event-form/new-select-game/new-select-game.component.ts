import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OptionComponent } from './option/option.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, map, startWith } from 'rxjs';
import { Game } from '../../../models/game';
import { APIService } from '../../../services/api.service';

@Component({
  selector: 'app-new-select-game',
  standalone: true,
  imports: [
    CommonModule,
    OptionComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './new-select-game.component.html',
  styleUrl: './new-select-game.component.css'
})
export class NewSelectGameComponent {
  games: Game[] = [];

  searchControl = new FormControl();
  filteredGames = new BehaviorSubject<Game[]>([]);

  isOpen = false;
  selectedGame: Game | undefined;

  constructor(private apiService: APIService) {
    this.apiService.getGames().subscribe(games => {
      this.games = games;
      this.filteredGames.next(this.games.slice(0, 5));
      this.selectedGame = this.games[0];
    });

    this.searchControl.valueChanges.subscribe(text => {
      this.filteredGames.next(this.filterOptions(text || ''));
    });
  }

  private filterOptions(text: string) {
    return this.games
      .filter(option => option.name.toLowerCase().includes(text.toLowerCase()))
      .slice(0, 5);
  }

  onOptionSelected(game: Game) {
    const selected = this.games.find(opt => opt.id === game.id);
    if (selected) {
      this.selectedGame = selected;
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
