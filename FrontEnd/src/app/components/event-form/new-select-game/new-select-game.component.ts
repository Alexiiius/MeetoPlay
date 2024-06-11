import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OptionComponent } from './option/option.component';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Game } from '../../../models/game';
import { APIService } from '../../../services/api.service';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-new-select-game',
  standalone: true,
  imports: [
    CommonModule,
    OptionComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './new-select-game.component.html',
  styleUrl: './new-select-game.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewSelectGameComponent),
      multi: true
    }
  ]
})
export class NewSelectGameComponent implements OnInit, OnDestroy, ControlValueAccessor {
  games: Game[] = [];
  isLoading = true;

  searchControl = new FormControl();
  filteredGames = new BehaviorSubject<Game[]>([]);

  isOpen = false;
  hasBeenTouched = false;
  selectedGame: Game | undefined = { id: -1, name: '👾 Seleccione un juego', image: '' };

  @Output() gameSelected = new EventEmitter<Game>();
  @Output() gamesEmitter = new EventEmitter<Game[]>();
  @Output() selectGameTouched = new EventEmitter<void>();

  @Input() isInvalid: boolean = false;
  @Input() event: Event;
  @Input() optionsLimit: number = 5;
  @Input() gameId: number | undefined = undefined;

  private subscriptions: Subscription[] = [];

  constructor(private apiService: APIService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.apiService.getGames().subscribe(games => {
        this.games = games;
        this.filteredGames.next(this.games.slice(0, 5));
        this.isLoading = false;
        this.gamesEmitter.emit(this.games);

        // Si hay un evento, selecciona el juego correspondiente
        if (this.event && this.event.game_id) {
          const game = this.games.find(game => game.id == this.event.game_id);
          if (game) {
            this.toggle();
            this.onOptionSelected(game);
          }
        }

        //Si hay gameId, selecciona el juego correspondiente
        if (this.gameId) {
          const game = this.games.find(game => game.id == this.gameId);
          if (game) {
            this.toggle();
            this.onOptionSelected(game);
          }
        }
      })
    );

    this.subscriptions.push(
      this.searchControl.valueChanges.subscribe(text => {
        this.filteredGames.next(this.filterOptions(text || ''));
      })
    );
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
      this.gameSelected.emit(selected);
      this.toggle();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: globalThis.Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      if (this.hasBeenTouched) {
        this.selectGameTouched.emit();
      }
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.hasBeenTouched = true;
  }

  writeValue(obj: Game): void {
    this.selectedGame = obj;
  }

  registerOnChange(fn: any): void {
    this.gameSelected.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    // You can implement this method if you need to handle the touch event
  }

  ngOnDestroy() {
    // Cancelar todas las suscripciones cuando se destruye el componente para evitar fugas de memoria.
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
