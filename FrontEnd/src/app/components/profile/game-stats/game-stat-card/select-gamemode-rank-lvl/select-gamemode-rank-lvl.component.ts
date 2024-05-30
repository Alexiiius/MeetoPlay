import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Gamemode } from '../../../../../models/gamemode';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../../services/api.service';
import { NewFullGame } from '../../../../../interfaces/new-fullGame';
import { FormatedNewGamemodeStat } from '../../../../../interfaces/formated-new-gamemode-stat';
import { UserService } from '../../../../../services/user.service';
import { AlertService } from '../../../../../services/alert.service';
import { ProfileService } from '../../../../../services/profile.service';
import { GamemodeStat } from '../../../../../interfaces/gamemode-stat';

@Component({
  selector: 'tr[app-select-gamemode-rank-lvl]',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './select-gamemode-rank-lvl.component.html',
  styleUrl: './select-gamemode-rank-lvl.component.css'
})
export class SelectGamemodeRankLvlComponent {

  @Input() gamemodeStatToEdit: GamemodeStat
  @Input() gamemodes: Gamemode[] = [];
  @Input() gameId: number;
  @Input() gameUserStatsId: number;
  @Input() fullGame: NewFullGame;
  @Input() isLoading: boolean = false;

  @Output() deleteRequest = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private profileService: ProfileService
  ) { }

  gamemodeStatForm: FormGroup;
  selectedGamemode: Gamemode | undefined;

  isSaving: boolean = false;

  isEditing: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gamemodes'] && changes['gamemodes'].currentValue) {
      this.initializeForm();
    }
  }

  initializeForm() {
    let initialGamemodeValue: string | number = 'default';

    if (this.gamemodeStatToEdit) {
      this.isEditing = true;
      console.log('Se está editando un gamemodeStat');
      this.selectedGamemode = this.gamemodes ? this.gamemodes.find(gamemode => gamemode.name == this.gamemodeStatToEdit.gamemode_name) : undefined;
      if (this.selectedGamemode) {
        initialGamemodeValue = this.selectedGamemode.id;
      }
      console.log('GamemodeStatToEdit:', this.gamemodeStatToEdit);
    }

    this.gamemodeStatForm = this.formBuilder.group({
      gamemode: [initialGamemodeValue, [Validators.required, this.gamemodeBelongsToGame.bind(this)]]
    });

    this.onGamemodeChange();
  }

  //Comprueba que el gamemode seleccionado pertenece al game selecionado
  gamemodeBelongsToGame(control: AbstractControl): ValidationErrors | null {
    const gamemode = this.gamemodes ? this.gamemodes.find(gm => gm.id == control.value) : undefined;
    return gamemode && this.fullGame && gamemode.game_id == this.fullGame.id ? null : { gamemodeNotBelongsToGame: true };
  }

  //Comprueba que el valor del Rango pertenece a los rangos del gamemode seleccionado
  rankBelongsToGamemode(control: AbstractControl): ValidationErrors | null {
    const rank = control.value;
    return this.selectedGamemode && this.selectedGamemode.ranks.includes(rank) ? null : { rankNotBelongsToGamemode: true };
  }

  onDelete() {
    this.deleteRequest.emit();
  }

  onGamemodeChange() {
    this.selectedGamemode = this.gamemodes.find(gamemode => gamemode.id == this.gamemodeStatForm.value.gamemode);
    if (this.selectedGamemode) {
      this.selectedGamemode.ranked = Number(this.selectedGamemode.ranked) == 1 ? true : false;
      if (this.selectedGamemode?.ranked) {
        const initialRankValue = this.gamemodeStatToEdit ? this.gamemodeStatToEdit.gamemodes_rank : 'default';
        this.gamemodeStatForm.addControl('rank', new FormControl(initialRankValue, [Validators.required, this.rankBelongsToGamemode.bind(this)]));
        this.gamemodeStatForm.removeControl('lvl');
      } else {
        const initialLvlValue = this.gamemodeStatToEdit ? this.gamemodeStatToEdit.gamemodes_rank : '';
        this.gamemodeStatForm.addControl('lvl', new FormControl(initialLvlValue, [Validators.required, this.minZero, this.integerValidator()]));
        this.gamemodeStatForm.removeControl('rank');
      }
    }
  }

  isInvalid(field: string): boolean {
    if (this.gamemodeStatForm.controls[field]) {
      return this.gamemodeStatForm.controls[field].invalid && (this.gamemodeStatForm.controls[field].dirty || this.gamemodeStatForm.controls[field].touched);
    }
    return false;
  }

  //Comprueba que el valor de maxParticipants sea mayor que 0
  minZero(control: AbstractControl) {
    const value = control.value;
    return value >= 0 ? null : { minZero: true };
  }

  integerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isInteger = Number.isInteger(Number(control.value));
      return !isInteger ? { 'notInteger': { value: control.value } } : null;
    };
  }

  cancelEdit() {
    this.profileService.gamemodeStatEditCancelled.next();
    this.deleteRequest.emit();
  }

  onSave() {
    this.isSaving = true;

    const gamemode = this.gamemodes.find(gamemode => gamemode.id == this.gamemodeStatForm.value.gamemode);
    console.log('Gamemode:', gamemode);

    if (gamemode) {
      const formatedNewGamemodeStat: FormatedNewGamemodeStat = {
        game_user_stats_id: this.gameUserStatsId,
        gamemode_name: gamemode.name,
        gamemodes_rank: this.gamemodeStatForm.value.rank ? this.gamemodeStatForm.value.rank : this.gamemodeStatForm.value.lvl
      };

      if (this.isEditing) {

        this.userService.editGamemodeStat(formatedNewGamemodeStat, this.gamemodeStatToEdit.id).subscribe(
          (response) => {
            console.log(response);
            this.alertService.showAlert('success', 'GameStat editado con éxito! 😄');
            this.profileService.gamemodeStatEdited.next(response.data.GameUserStats);
            this.deleteRequest.emit();
            this.isSaving = false;
          },

          (error) => {
            this.alertService.showAlert('error', 'Error! Algo ha fallado al editar el GameStat. 😓');
            this.isSaving = false;
            console.error(error);
          });

      } else {

        this.userService.postGamemodeStat(formatedNewGamemodeStat).subscribe(
          (response) => {
            console.log(response);
            this.alertService.showAlert('success', 'GameStat creado con éxito! 😄');
            this.profileService.gameStatCreated.next(response.data.GameUserStats);
            this.profileService.gamemodeStatCreated.next(response.data.GameUserStats);
            this.deleteRequest.emit();
            this.isSaving = false;
          },

          (error) => {

            if (error.status === 409) {
              this.alertService.showAlert('warning', 'Ya tienes un GameStat creado para ese gamemode. 😅');
              this.isSaving = false;
            } else {
              this.alertService.showAlert('error', 'Error! Algo ha fallado al crear el GameStat. 😓');
              this.isSaving = false;
            }
            console.error(error);
          });
      }
    }
  }

}

