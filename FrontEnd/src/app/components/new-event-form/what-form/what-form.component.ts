import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { SelectGameComponent } from './select-game/select-game.component';
import { SelectPlatformComponent } from './select-platform/select-platform.component';
import { SelectGamemodeComponent } from './select-gamemode/select-gamemode.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { APIService } from '../../../services/api.service';
import { NewEventFormService } from '../../../services/new-event-form.service';
import { Router } from '@angular/router';
import { concatMap, filter, map, tap } from 'rxjs';
import { Game } from '../../../models/game';
import { FullGame } from '../../../models/fullgame';
import { Event } from '../../../models/event';

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
    private newEventFormService: NewEventFormService,
    private router: Router,
  ) { }

  games: Game[] = [];
  selectedGame: FullGame | null;

  whatForm: FormGroup;

  @Input() event: Event;

  // ngOnInit(): void {
  //   this.whatForm = this.formBuilder.group({
  //     ranked: [false],
  //     title: [this.event.event_title || '', Validators.required],
  //     game: ['', [this.gameSelectedValidator(), Validators.required]],
  //     platform: [ '', Validators.required],
  //     gameMode: [ '', Validators.required],
  //   });

  //   this.apiService.getGames().pipe(
  //     tap((response: Game[]) => {
  //       this.games = response;
  //     }),
  //     concatMap(() => this.newEventFromService.selectedGame$)
  //   ).subscribe(game => {
  //     this.selectedGame = game;

  //     // Update game control validators
  //     const platformControl = this.whatForm.get('platform');
  //     if (platformControl) {
  //       platformControl.setValidators([this.platformSelectedValidator(), Validators.required]);
  //       platformControl.updateValueAndValidity();
  //     }
  //     const gameModeControl = this.whatForm.get('gameMode');
  //     if (gameModeControl) {
  //       gameModeControl.setValidators([this.gameModeSelectedValidator(), Validators.required]);
  //       gameModeControl.updateValueAndValidity();
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.whatForm = this.formBuilder.group({
      ranked: [false],
      title: [this.event ? this.event.event_title : '', { validators: Validators.required, updateOn: 'change' }],
      game: ['', { validators: [this.gameSelectedValidator(), Validators.required], updateOn: 'change' }],
      platform: [ null, { validators: Validators.required, updateOn: 'change' }],
      gameMode: [ null, { validators: Validators.required, updateOn: 'change' }],
    });

    this.apiService.getGames().pipe(
      tap((response: Game[]) => {
        this.games = response;
      }),
      concatMap(() => this.newEventFormService.selectedGame$.pipe(
        filter(({ componentId }) => this.event ? componentId === this.event.id : componentId === 0),
        map(({ game }) => game)
      ))
    ).subscribe(game => {
      this.selectedGame = game;

      // Update game control validators
      const platformControl = this.whatForm.get('platform');
      if (platformControl) {
        platformControl.setValidators([this.platformSelectedValidator(), Validators.required]);
        platformControl.updateValueAndValidity();
      }
      const gameModeControl = this.whatForm.get('gameMode');
      if (gameModeControl) {
        gameModeControl.setValidators([this.gameModeSelectedValidator(), Validators.required]);
        gameModeControl.updateValueAndValidity();
      }
    });

    if (this.selectedGame) {
      this.newEventFormService.changeSelectedGame(this.event.id, this.selectedGame);
    }
  }

  isRoute(route: string): boolean {
    return this.router.url === route;
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

  platformSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedPlatform = control.value;
      console.log(selectedPlatform);
      if (!selectedPlatform) {
        return { 'platformNotSelected': { value: control.value } };
      }
      const isPlatformSelected = this.selectedGame?.game.platforms.some(platform => platform.id === selectedPlatform);
      return isPlatformSelected ? null : { 'platformNotSelected': { value: control.value } };
    };
  }

  gameModeSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedGameMode = control.value;
      console.log(selectedGameMode);
      if (!selectedGameMode) {
        return { 'gameModeNotSelected': { value: control.value } };
      }
      const isGameModeSelected = this.selectedGame?.game.gamemodes.some(gameMode => gameMode.id === selectedGameMode.id);
      return isGameModeSelected ? null : { 'gameModeNotSelected': { value: control.value } };
    };
  }

  onSubmit() {
    let storedForm = sessionStorage.getItem('newEventForm');
    let newEventForm = storedForm ? JSON.parse(storedForm) : {};
    newEventForm.whatForm = this.whatForm.value;
    sessionStorage.setItem('newEventForm', JSON.stringify(newEventForm));
    this.router.navigate(['/main/newEvent/when']);
  }
}
