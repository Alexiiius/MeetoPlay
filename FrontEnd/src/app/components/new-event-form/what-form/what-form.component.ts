import { Component, OnInit } from '@angular/core';
import { SelectGameComponent } from './select-game/select-game.component';
import { SelectPlatformComponent } from './select-platform/select-platform.component';
import { SelectGamemodeComponent } from './select-gamemode/select-gamemode.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { APIService } from '../../../services/api-service.service';
import { NewEventFormService } from '../../../services/new-event-form-service.service';
import { Game } from '../../../models/game';
import { Router } from '@angular/router';

@Component({
  selector: 'app-what-form',
  standalone: true,
  imports: [
    SelectGameComponent,
    SelectPlatformComponent,
    SelectGamemodeComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './what-form.component.html',
  styleUrl: './what-form.component.css'
})
export class WhatFormComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private newEventFromService: NewEventFormService,
    private router: Router
  ) { }

  games: Game[] = [];
  selectedGame: Game | null;

  ngOnInit(): void {
    // Get games from API
    this.apiService.getGames().subscribe((data) => {
      this.games = data.games.map(game =>
        new Game(game.id, game.name, game.image, game.account_level_name, game.nickname_name, game.description, game.platforms, game.game_modes));
    });

    // Subscribe to selected game
    this.newEventFromService.selectedGame$.subscribe(game => {
      this.selectedGame = game;
      // Update game control validators
      const platformControl = this.whatForm.get('platform');
      if (platformControl) {
        platformControl.setValidators([this.platformSelectedValidator(), Validators.required]);
        platformControl.updateValueAndValidity();
      }
    });
  }

  whatForm = this.formBuilder.group({
    title: ['', Validators.required],
    game: ['', [this.gameSelectedValidator(), Validators.required]],
    platform: ['', Validators.required],
    gameMode: ['', Validators.required],
  });

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

  platformSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedPlatform = control.value;
      if (!selectedPlatform) {
        return { 'platformNotSelected': { value: control.value } };
      }
      const isPlatformSelected = this.selectedGame?.platforms.some(platform => platform.id === Number(selectedPlatform));
      return isPlatformSelected ? null : { 'platformNotSelected': { value: control.value } };
    };
  }

  gameModeSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedGameMode = control.value;
      if (!selectedGameMode) {
        console.log('control.value: ', control.value);
        return { 'gameModeNotSelected': { value: control.value } };
      }
      const isGameModeSelected = this.selectedGame?.game_modes.some(gameMode => gameMode.id === selectedGameMode.id);
      return isGameModeSelected ? null : { 'gameModeNotSelected': { value: control.value } };
    };
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.whatForm.value);
    this.router.navigate(['/newEvent/when']);
  }
}
