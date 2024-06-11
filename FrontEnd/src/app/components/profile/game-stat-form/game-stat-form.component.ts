import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { GameStat } from '../../../interfaces/game-stat';
import { NewSelectGameComponent } from '../../event-form/new-select-game/new-select-game.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Game } from '../../../models/game';
import { CommonModule } from '@angular/common';
import { FormatedNewGameStat } from '../../../interfaces/formated-new-game-stat';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-game-stat-form',
  standalone: true,
  imports: [
    NewSelectGameComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './game-stat-form.component.html',
  styleUrl: './game-stat-form.component.css'
})
export class GameStatFormComponent implements OnInit {

  @Input() gameStat: GameStat | null = null;
  isUpdating: boolean = false;

  gameStatForm: FormGroup;
  games: Game[] = [];

  selectedGame: Game;
  gamemodesLoading: boolean = false;

  isFormSubmmiting: boolean = false;

  @ViewChild('gameStatFormModal') modalDialog!: ElementRef<HTMLDialogElement>;

  constructor(
    private formBuilder: FormBuilder) { }

  userService = inject(UserService);
  alertService = inject(AlertService);
  profileService = inject(ProfileService);

  ngOnInit(): void {
    this.isUpdating = !!this.gameStat;

    this.gameStatForm = this.formBuilder.group({
      nickname: [this.isUpdating ? this.gameStat?.nickname_game : '', [Validators.required]],
      game: [{ id: -1, name: '👾 Seleccione un juego', image: '' }, [Validators.required, this.gameExists.bind(this)]],
      level: [this.isUpdating ? this.gameStat?.lv_account : '', [Validators.required]],
      hours_played: [this.isUpdating ? this.gameStat?.hours_played : '', [Validators.required]],
    });
  }

  openModal(): void {
    this.modalDialog.nativeElement.showModal();
  }

  closeModal(): void {
    this.modalDialog.nativeElement.close();
  }

  isInvalid(fieldName: string) {
    const field = this.gameStatForm?.get(fieldName);
    return field?.invalid && field?.touched || false;
  }

  handleGamesLoaded(games: Game[]): void {
    this.games = games;
  }

  handleSelectGameTouched() {
    this.gameStatForm?.get('game')?.markAsTouched();
  }

  //Comprueba si el campo game contiene un juego que existe en el array de juegos
  gameExists(control: AbstractControl): ValidationErrors | null {
    const game = this.games.find(g => g.id === control.value.id);
    return game ? null : { gameNotFound: true };
  }

  async onSubmit(): Promise<void> {
    this.isFormSubmmiting = true;

    const newGameStat: FormatedNewGameStat = {
      game_id: this.gameStatForm?.get('game')?.value.id,
      game_name: this.gameStatForm?.get('game')?.value.name,
      hours_played: this.gameStatForm?.get('hours_played')?.value,
      lv_account: this.gameStatForm?.get('level')?.value,
      nickname_game: this.gameStatForm?.get('nickname')?.value,
      game_pic: this.gameStatForm?.get('game')?.value.image
    };

    if (this.isUpdating) {
      if (this.gameStat) {
        this.userService.editGameStat(newGameStat, this.gameStat?.id).subscribe(
          (response) => {
            console.log(response)
            this.isFormSubmmiting = false;
            this.alertService.showAlert('success', 'GameStat actualizado con éxito! 😄');
            this.profileService.gameStatEdited.next(response.data.GameUserStats);
            console.log(response);
            this.closeModal();
          },
          (error) => {
            this.isFormSubmmiting = false;
            this.alertService.showAlert('error', 'Error! Algo ha fallado al actualizar el GameStat. 😓');
            console.error(error);
          });
      }

    } else {

      this.userService.postGameStat(newGameStat).subscribe(
        (response) => {
          console.log(response)
          this.isFormSubmmiting = false;
          this.alertService.showAlert('success', 'GameStat creado con éxito! 😄');
          this.profileService.gameStatCreated.next(response.data.GameUserStats);
          console.log(response);
          this.closeModal();

          this.gameStatForm.reset({
            nickname: '',
            game: { id: -1, name: '👾 Seleccione un juego', image: '' },
            level: '',
            hours_played: ''
          });
        },
        (error) => {
          this.isFormSubmmiting = false;
          if (error.status === 409) {
            this.alertService.showAlert('warning', `Ya tienes un GameStat para ${this.gameStatForm?.get('game')?.value.name}. 👻`);
            this.closeModal();
          } else {
            this.alertService.showAlert('error', 'Error! Algo ha fallado al crear el GameStat. 😓');
          }
          console.error(error);
        });
    }
  }
}

