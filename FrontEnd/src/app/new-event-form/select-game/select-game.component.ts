import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Game } from '../../models/game';


@Component({
  selector: 'app-select-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select-game.component.html',
  styleUrl: './select-game.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectGameComponent),
      multi: true
    }
  ]
})
export class SelectGameComponent implements ControlValueAccessor {

  @Input() games: Game[] = [];
  @Output() selectionChange = new EventEmitter<string>();

  value: any;
  onChange: any = () => {};
  onTouch: any = () => {};

  searchValue = '';

  selectedGame: Game | null = null;
  showDropdown = false;
  gameSelected = false;

  get filteredGames() {
    if (!this.searchValue) return this.games;
    return this.games.filter(game => game.name.toLowerCase().includes(this.searchValue.toLowerCase()));
  }

  updateSearchValue(value: string) {
    this.searchValue = value;
    this.onChange(value);
    this.gameSelected = false;
  }

  writeValue(value: Game): void {
    this.selectedGame = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  toggleDropdown(open: boolean) {
    if (open) {
      this.showDropdown = true;
    } else {
      setTimeout(() => {
        this.showDropdown = false;
      }, 100);
    }
  }

  selectGame(game: Game) {
    this.selectedGame = game;
    this.searchValue = game.name;
    this.showDropdown = false;
    this.gameSelected = true;
    this.onChange(game);
    this.onTouch();
  }

  selectOption(value: string) {
    this.value = value;
    this.onChange(value);
    this.onTouch();
    this.selectionChange.emit(value);
  }

  resetSearch() {
    this.searchValue = '';
    this.selectedGame = null;
    this.gameSelected = false;
    this.onChange();
  }
}
