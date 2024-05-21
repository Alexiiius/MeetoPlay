import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormRecord, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { SelectGameComponent } from '../new-event-form/what-form/select-game/select-game.component';
import { SelectGamemodeComponent } from '../new-event-form/what-form/select-gamemode/select-gamemode.component';
import { SelectPlatformComponent } from '../new-event-form/what-form/select-platform/select-platform.component';
import { Game } from '../../models/game';
import { APIService } from '../../services/api.service';
import { NewEventFormService } from '../../services/new-event-form.service';
import { concatMap, tap } from 'rxjs';
import { FullGame } from '../../models/fullgame';

@Component({
  selector: 'app-wip',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectGameComponent,
    SelectGamemodeComponent,
    SelectPlatformComponent
  ],
  templateUrl: './wip.component.html',
  styleUrl: './wip.component.css'
})
export class WipComponent implements OnInit {

  whatFormEdit: FormGroup;

  games: Game[] = [];
  selectedGame: FullGame | null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private newEventFromService: NewEventFormService,
  ) { }

  ngOnInit(): void {
    this.apiService.getGames().pipe(
      tap((response: Game[]) => {
        this.games = response;
      }),
      concatMap(() => this.newEventFromService.selectedGame$)
    ).subscribe(game => {
      this.selectedGame = game;

      // Update game control validators
      const platformControl = this.whatFormEdit.get('platform');
      if (platformControl) {
        platformControl.setValidators([this.platformSelectedValidator(), Validators.required]);
        platformControl.updateValueAndValidity();
      }
      const gameModeControl = this.whatFormEdit.get('gameMode');
      if (gameModeControl) {
        gameModeControl.setValidators([this.gameModeSelectedValidator(), Validators.required]);
        gameModeControl.updateValueAndValidity();
      }
    });

    this.whatFormEdit = this.formBuilder.group({
      ranked: [false],
      title: ['', Validators.required],
      game: ['', [this.gameSelectedValidator(), Validators.required]],
      platform: ['', Validators.required],
      gameMode: ['', Validators.required],
    });
  }

  platformSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedPlatform = control.value;
      if (!selectedPlatform) {
        return { 'platformNotSelected': { value: control.value } };
      }
      const isPlatformSelected = this.selectedGame?.game.platforms.some(platform => platform.id === selectedPlatform.id);
      return isPlatformSelected ? null : { 'platformNotSelected': { value: control.value } };
    };
  }

  gameModeSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedGameMode = control.value;
      if (!selectedGameMode) {
        return { 'gameModeNotSelected': { value: control.value } };
      }
      const isGameModeSelected = this.selectedGame?.game.gamemodes.some(gameMode => gameMode.id === selectedGameMode.id);
      return isGameModeSelected ? null : { 'gameModeNotSelected': { value: control.value } };
    };
  }

  gameSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedGame = control.value;
      if (!selectedGame) {
        return { 'gameNotSelected': { value: control.value } };
      }
      const isGameSelected = this.games.some(game => game.id === selectedGame.id);
      return isGameSelected ? null : { 'gameNotSelected': { value: control.value } };
    };
  }
}
