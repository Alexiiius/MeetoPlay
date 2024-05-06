import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { Gamemode } from '../../../../models/gamemode';
import { Game } from '../../../../models/game';
import { NewEventFormService } from '../../../../services/new-event-form-service.service';
import { CommonModule } from '@angular/common';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-gamemode',
  standalone: true,
  imports: [
    CommonModule
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
  selectedGame: Game | null;

  @Input() isInvalid: boolean | undefined;
  @Input() ranked: boolean;
  @Input() whatForm: FormGroup;

  constructor(private newEventFormService: NewEventFormService) { }

  value: any;
  onChange: any = () => { };
  onTouch: any = () => { };

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
    this.value = gamemode;
    this.onChange(gamemode);
    this.onTouch();
    console.log(gamemode);
  }

  ngOnInit(): void {
     // Suscribirse a los cambios en el juego seleccionado
  this.newEventFormService.selectedGame$.subscribe(game => {
    this.selectedGame = game;
    this.filterGameModes();
  });

  // Suscribirse a los cambios en el valor de 'ranked'
  this.whatForm.get('ranked')?.valueChanges.subscribe(value => {
    this.ranked = value;
    this.filterGameModes();

  // Actualiza el valor de 'ranked' en el servicio
  this.newEventFormService.updateRanked(this.ranked);
  });
  }

  filterGameModes(): void {
    if (this.selectedGame) {
      // Filtrar los modos de juego basándose en el valor de 'ranked'
      this.options = this.selectedGame.game_modes.filter(gamemode => gamemode.ranked === this.ranked);
    } else {
      this.options = [{
        id: 0,
        name: 'No game selected',
        description: '',
        ranked: false,
        max_players: 0,
        min_players: 0,
        ranks: [''],
        scenario_name: [''],
        game_id: 0
      }];
    }
  }
}

