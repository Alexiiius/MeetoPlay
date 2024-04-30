import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SelectGameComponent } from './select-game/select-game.component';
import { APIService } from '../apiservice.service';
import { Game } from '../models/game';


@Component({
  selector: 'app-new-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectGameComponent
  ],
  templateUrl: './new-event-form.component.html',
  styleUrl: './new-event-form.component.css'
})
export class NewEventFormComponent {

  constructor(private formBuilder: FormBuilder, private apiService: APIService) { }

  games: Game[] = [];

  ngOnInit() {
    this.apiService.getGames().subscribe((data) => {
      this.games = data.games.map(game => new Game(game.id, game.name, game.image));
    });
  }

  newEventForm = this.formBuilder.group({
    what: this.formBuilder.group({
      title: ['', Validators.required],
      game: ['', [this.gameSelectedValidator(), Validators.required]],
      platform: ['', Validators.required],
      gameMode: ['', Validators.required],
    }),
    when: this.formBuilder.group({
      dateTimeBegin: ['', Validators.required],
      dateTimeEnd: ['', Validators.required],
    }),
  });

  // Propiedades para controlar la visibilidad de cada bloque
  showWhatBlock = true;
  showWhenBlock = false;
  showRequirementsBlock = false;
  showInscriptionBlock = false;
  showWhoBlock = false;
  showSubmitBtn = false;
  nextBtnState = 'disabled';
  // Agrega más propiedades si tienes más bloques

  // Método para pasar al siguiente bloque
  nextBlock() {
    if (this.showWhatBlock) {
      this.showWhatBlock = false;
      this.showWhenBlock = true;
    } else if (this.showWhenBlock) {
      this.showWhenBlock = false;
      this.showRequirementsBlock = true;
    } else if (this.showRequirementsBlock) {
      this.showRequirementsBlock = false;
      this.showInscriptionBlock = true;
    } else if (this.showInscriptionBlock) {
      this.showInscriptionBlock = false;
      this.showWhoBlock = true;
    } else if (this.showWhoBlock) {
      this.showWhoBlock = false;
      this.showSubmitBtn = true;
    }
  }

  gameSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const selectedGame = control.value;
      if (!selectedGame) {
        return { 'gameNotSelected': { value: control.value } };
      }
      const isGameSelected = this.games.some(game => game.id === selectedGame.id);
      return isGameSelected ? null : { 'gameNotSelected': { value: control.value } };
    };
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.newEventForm.value);
  }
}
