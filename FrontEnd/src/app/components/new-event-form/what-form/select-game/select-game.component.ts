import { NewEventFormService } from '../../../../services/new-event-form.service';
import { Game } from '../../../../models/game';
import { Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-select-game',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
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
  @Input() isInvalid: boolean | undefined;
  @Output() gameSelected = new EventEmitter<Game>();

  constructor(private newEventFromService: NewEventFormService) { }

  //Reactiveform
  value: any;
  onChange: any = () => {};
  onTouch: any = () => {};

  searchValue = '';
  selectedGame: Game | null;
  showDropdown = false;
  isGameSelected = false;
  isFocused = false;

  //Filter games based on search value
  get filteredGames() {
    if (!this.searchValue) return this.games;
    return this.games.filter(game => game.name.toLowerCase().includes(this.searchValue.toLowerCase()));
  }

  //Update search value
  updateSearchValue(value: string) {
    this.searchValue = value;
    this.onChange(value);
    this.isGameSelected = false;
    this.newEventFromService.changeSelectedGame(null);
    console.log(this.searchValue);
    console.log(this.selectedGame);
  }

  //Reactiveform
  writeValue(value: Game): void {
    this.selectedGame = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  //Toggle dropdown
  toggleDropdown(open: boolean) {
    if (open) {
      this.showDropdown = true;
    } else {
      setTimeout(() => {
        this.showDropdown = false;
      }, 100);
    }
  }

  //When a option of the dropdown is selected
  selectGame(game: Game) {
    this.selectedGame = game;
    this.searchValue = game.name;
    this.showDropdown = false;
    this.isGameSelected = true;
    this.onChange(game);
    this.onTouch();
    this.newEventFromService.changeSelectedGame(game);
  }

  //Reset search value
  resetSearch() {
    this.searchValue = '';
    this.selectedGame = null;
    this.isGameSelected = false;
    this.onChange();
    this.newEventFromService.changeSelectedGame(this.selectedGame);
  }
}
