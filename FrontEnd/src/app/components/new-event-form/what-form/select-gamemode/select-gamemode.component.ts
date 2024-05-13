import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { Gamemode } from '../../../../models/gamemode';
import { NewEventFormService } from '../../../../services/new-event-form.service';
import { CommonModule } from '@angular/common';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FullGame } from '../../../../models/fullgame';
import { filter } from 'rxjs';

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

  options: Gamemode[] = [{
    id: 0,
    name: 'No game selected',
    description: '',
    ranked: false,
    max_players: 0,
    ranks: [''],
    scenario_name: [''],
    game_id: 0
  }];

  selectedGame: FullGame | null;

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
    this.newEventFormService.changeSelectedGameMode(gamemode);
  }

  ngOnInit(): void {
    // Suscribirse a los cambios en el juego seleccionado
    this.newEventFormService.selectedGame$
      .pipe(filter(game => !!game)) // Ignora los valores nulos o indefinidos
      .subscribe(game => {
        this.selectedGame = game;
        this.filterGameModes();
      });

    console.log(this.selectedGame)

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
      this.options = this.selectedGame.game.gamemodes.filter(gamemode => {
        return !!gamemode.ranked === this.ranked; // Convertir a booleano para la comparación
      });
      console.log
    } else {
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

