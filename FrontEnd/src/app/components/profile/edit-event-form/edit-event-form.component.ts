import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Game } from '../../../models/game';
import { FullGame } from '../../../models/fullgame';
import { APIService } from '../../../services/api.service';
import { NewEventFormService } from '../../../services/new-event-form.service';
import { concatMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { WhatFormComponent } from '../../new-event-form/what-form/what-form.component';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-edit-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WhatFormComponent,
  ],
  templateUrl: './edit-event-form.component.html',
  styleUrl: './edit-event-form.component.css'
})
export class EditEventFormComponent {

  @Input() event: Event;

  // whatFormEdit: FormGroup;

  // games: Game[] = [];
  // selectedGame: FullGame | null;

  // constructor(
  //   private formBuilder: FormBuilder,
  //   private apiService: APIService,
  //   private newEventFromService: NewEventFormService,
  // ) { }

  // ngOnInit(): void {
  //   this.apiService.getGames().pipe(
  //     tap((response: Game[]) => {
  //       this.games = response;
  //     }),
  //     concatMap(() => this.newEventFromService.selectedGame$)
  //   ).subscribe(game => {
  //     this.selectedGame = game;

  //     // Update game control validators
  //     const platformControl = this.whatFormEdit.get('platform');
  //     if (platformControl) {
  //       platformControl.setValidators([this.platformSelectedValidator(), Validators.required]);
  //       platformControl.updateValueAndValidity();
  //     }
  //     const gameModeControl = this.whatFormEdit.get('gameMode');
  //     if (gameModeControl) {
  //       gameModeControl.setValidators([this.gameModeSelectedValidator(), Validators.required]);
  //       gameModeControl.updateValueAndValidity();
  //     }
  //   });

  //   this.whatFormEdit = this.formBuilder.group({
  //     ranked: [false],
  //     title: ['', Validators.required],
  //     game: ['', [this.gameSelectedValidator(), Validators.required]],
  //     platform: ['', Validators.required],
  //     gameMode: ['', Validators.required],
  //   });
  // }

  // platformSelectedValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const selectedPlatform = control.value;
  //     if (!selectedPlatform) {
  //       return { 'platformNotSelected': { value: control.value } };
  //     }
  //     const isPlatformSelected = this.selectedGame?.game.platforms.some(platform => platform.id === selectedPlatform.id);
  //     return isPlatformSelected ? null : { 'platformNotSelected': { value: control.value } };
  //   };
  // }

  // gameModeSelectedValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const selectedGameMode = control.value;
  //     if (!selectedGameMode) {
  //       return { 'gameModeNotSelected': { value: control.value } };
  //     }
  //     const isGameModeSelected = this.selectedGame?.game.gamemodes.some(gameMode => gameMode.id === selectedGameMode.id);
  //     return isGameModeSelected ? null : { 'gameModeNotSelected': { value: control.value } };
  //   };
  // }

  // gameSelectedValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const selectedGame = control.value;
  //     if (!selectedGame) {
  //       return { 'gameNotSelected': { value: control.value } };
  //     }
  //     const isGameSelected = this.games.some(game => game.id === selectedGame.id);
  //     return isGameSelected ? null : { 'gameNotSelected': { value: control.value } };
  //   };
  // }
}
