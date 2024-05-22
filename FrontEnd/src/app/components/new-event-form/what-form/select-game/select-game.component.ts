import { NewEventFormService } from '../../../../services/new-event-form.service';
import { Game } from '../../../../models/game';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../services/api.service';
import { FullGame } from '../../../../models/fullgame';
import { map, Observable } from 'rxjs';
import { Event } from '../../../../models/event';


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
export class SelectGameComponent implements ControlValueAccessor, OnInit {

  // @Input() games: Game[] = [];
  @Input() isInvalid: boolean | undefined;
  @Input() event: Event;
  @Output() gameSelected = new EventEmitter<Game>();

  constructor(private newEventFormService: NewEventFormService, private apiService: APIService) { }

  //Reactiveform
  value: any;
  onChange: any = () => { };
  onTouch: any = () => { };

  searchValue = '';
  selectedGame: FullGame | null;
  showDropdown = false;
  isGameSelected = false;
  isFocused = false;
  imageLoaded = false;

  private _games: Game[];

  @Input()
  set games(games: Game[]) {
    this._games = games;
    setTimeout(() => this.selectMatchingGame(), 0);
  }

  get games(): Game[] {
    return this._games;
  }

  selectMatchingGame() {
    if (this.event && this.event.game_name && this._games) {
      const matchingGame = this._games.find(game => game.name === this.event.game_name);
      if (matchingGame) {
        this.selectGame(matchingGame);
      }
    } else {
      this.resetSearch();
    }
  }

  ngOnInit() {
    this.selectMatchingGame();
  }

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
    this.newEventFormService.changeSelectedGame(this.event.id, null);
    this.imageLoaded = false;
  }

  //Reactiveform
  writeValue(value: FullGame): void {
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
    this.searchValue = game.name;
    this.showDropdown = false;
    this.isGameSelected = true;
    this.onChange(game);
    this.onTouch();

    this.getFullGame(game.id).subscribe(fullGame => {
      this.selectedGame = fullGame;
      this.newEventFormService.changeSelectedGame(this.event ? this.event.id : 0, fullGame);
      this.imageLoaded = true;
    });

  }

  getFullGame(gameId: number): Observable<FullGame> {
    return this.apiService.getFullGame(gameId).pipe(map((response: FullGame) => {
      const fullGame = new FullGame(
        response.game
      );
      return fullGame;
    }));
  }

  //Reset search value
  resetSearch() {
    this.searchValue = '';
    this.selectedGame = null;
    this.isGameSelected = false;
    this.onChange();
    if (this.selectedGame) {
      this.newEventFormService.changeSelectedGame(this.event ? this.event.id : 0, this.selectedGame);
    }
    this.imageLoaded = false;
  }
}
