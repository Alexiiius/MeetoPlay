import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { Gamemode } from '../../../../models/gamemode';
import { NewEventFormService } from '../../../../services/new-event-form.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FullGame } from '../../../../models/fullgame';
import { filter, map } from 'rxjs';
import { Event } from '../../../../models/event';

@Component({
  selector: 'app-select-gamemode',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './select-gamemode.component.html',
  styleUrl: './select-gamemode.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectGamemodeComponent),
      multi: true
    }
  ],
})
export class SelectGamemodeComponent implements OnInit {

  options: Gamemode[] = [];

  selectedGame: FullGame | null = null;
  isGameSelected: boolean = false;

  @Input() isInvalid: boolean | undefined;
  @Input() ranked: boolean;
  @Input() whatForm: FormGroup;
  @Input() event: Event;

  value: any = null;
  onChange: any = () => { };
  onTouch: any = () => { };

  constructor(private newEventFormService: NewEventFormService) { }

  ngOnInit(): void {
    this.value = null;
    // Suscribirse a los cambios en el juego seleccionado
    this.newEventFormService.selectedGame$
      .pipe(
        filter(({ componentId }) => this.event ? componentId === this.event.id : componentId === 0),
        map(({ game }) => game),
        filter(game => !!game)
      )
      .subscribe(game => {
        this.selectedGame = game;
        this.filterGameModes();
        this.isGameSelected = !!game;

        // Seleccionar el modo de juego que coincide con event.game_mode
        if (this.event && this.event.game_mode) {
          const matchingGamemode = this.options.find(gamemode => gamemode.name === this.event.game_mode);

          if (matchingGamemode) {
            this.selectGamemode(matchingGamemode);
          }
        } else {
          this.value = null;
          this.selectedGame = null;
        }
      });

    // Suscribirse a los cambios en el valor de 'ranked'
    this.whatForm.get('ranked')?.valueChanges.subscribe(value => {
      this.ranked = value;
      this.filterGameModes();

      // Actualiza el valor de 'ranked' en el servicio
      this.newEventFormService.updateRanked(this.ranked);
    });
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  selectGamemode(gamemode: Gamemode) {
    this.value = gamemode.id;
    this.onChange(gamemode);
    this.onTouch();
    this.newEventFormService.changeSelectedGameMode(gamemode);

  }

  filterGameModes(): void {
    if (this.selectedGame) {
      // Filtrar los modos de juego basándose en el valor de 'ranked'
      this.options = this.selectedGame.game.gamemodes.filter(gamemode => {
        return !!gamemode.ranked === this.ranked; // Convertir a booleano para la comparación
      });

      // Si no hay modos de juego clasificados, establecer 'this.options' a un array con un objeto con 'name' establecido a 'No ranked modes'
      if (this.ranked && this.options.length === 0) {
        this.options = [{
          id: 0,
          name: 'No ranked modes',
          description: '',
          ranked: false,
          max_players: 0,
          ranks: [''],
          scenario_name: [''],
          game_id: 0
        }];
      }
    } else {
      console.log('No game selected');
      this.options = [{
        id: 0,
        name: 'No game selected',
        description: '',
        ranked: false,
        max_players: 0,
        ranks: [''],
        scenario_name: [''],
        game_id: 0
      }];
    }
  }
}

