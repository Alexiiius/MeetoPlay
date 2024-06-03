import { Event } from './../../models/event';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NewSelectGameComponent } from './new-select-game/new-select-game.component';
import { Game } from '../../models/game';
import { APIService } from '../../services/api.service';
import { Subscription } from 'rxjs';
import { Gamemode } from '../../models/gamemode';
import { Platform } from '../../models/platform';
import { CommonModule } from '@angular/common';
import { NewFullGame } from '../../interfaces/new-fullGame';
import { FormatedNewEvent } from '../../interfaces/formated-new-event';
import { UserService } from '../../services/user.service';
import { UserData } from '../../interfaces/user-data';
import { EventsService } from '../../services/events.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NewSelectGameComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit, OnDestroy {

  @Input() event: Event;
  eventForm: FormGroup;

  fullGame: NewFullGame;
  gamemodes: Gamemode[] = [];
  filteredGamemodes: Gamemode[] = [];
  platforms: Platform[] = [];
  games: Game[] = [];
  selectedGame: Game;

  gamemodesLoading = false;
  platformsLoading = false;

  inscriptionToggle: boolean = true;
  requirmentsToggle: boolean = false;
  ranked: boolean = false;

  ranks: string[] = [''];
  maxPlayers: number = 0;

  isFormSubmmiting = false;
  isUpdating: boolean;
  updateDataLoading = false;

  private subscriptions: Subscription[] = [];

  @ViewChildren('tab') tabs: QueryList<ElementRef>;
  @ViewChild('eventModal') modalDialog!: ElementRef<HTMLDialogElement>;


  openModal() {
    this.modalDialog.nativeElement.showModal();
  }

  closeModal() {
    this.modalDialog.nativeElement.close();
    this.eventForm.get('whatForm')?.get('title')?.markAsUntouched()
    this.eventForm.reset();
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private eventService: EventsService,
    private alertService: AlertService,
    private profileService: ProfileService) { }

  ngOnInit(): void {
    this.isUpdating = !!this.event;
    if (this.isUpdating) {
      this.updateDataLoading = true;
    }

    this.eventForm = this.formBuilder.group({
      whatForm: this.formBuilder.group({
        ranked: [false],
        title: ['', [Validators.required, this.noWhitespaceValidator()]],
        game: [{ id: -1, name: '👾 Seleccione un juego', image: '' }, [Validators.required, this.gameExists.bind(this)]],
        gamemode: ['default', [Validators.required, this.gamemodeBelongsToGame.bind(this)]],
        platform: ['default', [Validators.required, this.platformBelongsToGame.bind(this)]],
      }),
      whenForm: this.formBuilder.group({
        inscriptionToggle: [true],
        eventBegin: [null, [Validators.required, this.notInPastValidator()]],
        eventEnd: [null, Validators.required],
        inscriptionBegin: [null, Validators.required],
        inscriptionEnd: [null, Validators.required]
      }),
      whoForm: this.formBuilder.group({
        privacy: ['default', [Validators.required, this.privacyNotDefault.bind(this)]],
        maxParticipants: [null, [Validators.required, this.minZero.bind(this), this.maxPlayersValidator.bind(this), this.integerValidator()]],
        requirmentsToggle: [false],
        rank: [false], // Para el checkbox de Rango
        maxRank: [{ value: '', disabled: true }, Validators.required], // Para el input de Max en Rango
        minRank: [{ value: '', disabled: true }, Validators.required], // Para el input de Min en Rango
        level: [false], // Para el checkbox de Por nivel
        maxLevel: [{ value: '', disabled: true }, [Validators.required, this.minZero, this.integerValidator()]], // Para el input de Max en Por nivel
        minLevel: [{ value: '', disabled: true }, [Validators.required, this.minZero, this.integerValidator()]], // Para el input de Min en Por nivel
        hoursPlayed: [false], // Para el checkbox de Horas jugadas
        maxHours: [{ value: '', disabled: true }, [Validators.required, this.minZero, this.integerValidator()]], // Para el input de Max en Horas jugadas
        minHours: [{ value: '', disabled: true }, [Validators.required, this.minZero, this.integerValidator()]] // Para el input de Min en Horas jugadas
      },
        {
          validators: [
            this.rankOrderValidator('minRank', 'maxRank'),
            this.maxGreaterThanMin('maxLevel', 'minLevel'),
            this.maxGreaterThanMin('maxHours', 'minHours')
          ]
        })
    });

    this.eventForm.get('whenForm')?.get('inscriptionToggle')?.valueChanges.subscribe(value => {
      this.inscriptionToggle = value;
      this.toggleInscription();
    });

    this.eventForm.get('whatForm')?.get('ranked')?.valueChanges.subscribe(value => {
      this.ranked = value;

      const whatForm = this.eventForm.get('whatForm');
      if (whatForm) {
        whatForm.patchValue({
          gamemode: 'default',
        });
        whatForm.get('gamemode')?.markAsUntouched();
      }
    });

    this.eventForm.get('whoForm')?.get('requirmentsToggle')?.valueChanges.subscribe(value => {
      this.requirmentsToggle = value;

      const whoForm = this.eventForm.get('whoForm');

      //
      if (whoForm) {
      }
    });

    this.eventForm.get('whatForm')?.get('gamemode')?.valueChanges.subscribe(gamemodeId => {
      // Busca el gamemode en el array filteredGamemodes utilizando el ID
      const gamemode = this.filteredGamemodes.find(gm => gm.id == gamemodeId);

      // Si se encontró el gamemode, actualiza los ranks
      if (gamemode) {
        this.ranks = gamemode.ranks;
        this.maxPlayers = gamemode.max_players;
      }

      this.eventForm.get('whoForm')?.reset({ privacy: 'default' })
    });

    this.eventForm.get('whenForm')?.get('eventBegin')?.valueChanges.subscribe((value) => {
      if (value) {
        const eventBeginDate = new Date(value);
        const inscriptionEndDate = new Date(eventBeginDate);

        // Formatea la fecha al formato correcto
        const formattedDate = inscriptionEndDate.toISOString().slice(0, 16);
        this.eventForm.get('whenForm')?.get('inscriptionEnd')?.setValue(formattedDate);

        const inscriptionBeginDate = new Date(inscriptionEndDate);
        inscriptionBeginDate.setDate(inscriptionEndDate.getDate() - 7);

        // Formatea la fecha al formato correcto
        const formattedBeginDate = inscriptionBeginDate.toISOString().slice(0, 16);
        this.eventForm.get('whenForm')?.get('inscriptionBegin')?.setValue(formattedBeginDate);

        // Detecta los cambios después de establecer los valores
        this.cdr.detectChanges();
      }
    });

    this.eventForm.get('whenForm')?.valueChanges.subscribe(() => {
      this.dateRangeValidator(this.eventForm.get('whenForm') as FormGroup);
    });

    this.eventForm.get('whoForm')?.get('rank')?.valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('whoForm')?.get('maxRank')?.enable();
        this.eventForm.get('whoForm')?.get('minRank')?.enable();
      } else {
        this.eventForm.get('whoForm')?.get('maxRank')?.disable();
        this.eventForm.get('whoForm')?.get('minRank')?.disable();
      }
    });

    // Suscribirse a los cambios en el valor de 'level'
    this.eventForm.get('whoForm')?.get('level')?.valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('whoForm')?.get('maxLevel')?.enable();
        this.eventForm.get('whoForm')?.get('minLevel')?.enable();
      } else {
        this.eventForm.get('whoForm')?.get('maxLevel')?.disable();
        this.eventForm.get('whoForm')?.get('minLevel')?.disable();
      }
    });

    // Suscribirse a los cambios en el valor de 'hoursPlayed'
    this.eventForm.get('whoForm')?.get('hoursPlayed')?.valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('whoForm')?.get('maxHours')?.enable();
        this.eventForm.get('whoForm')?.get('minHours')?.enable();
      } else {
        this.eventForm.get('whoForm')?.get('maxHours')?.disable();
        this.eventForm.get('whoForm')?.get('minHours')?.disable();
      }
    });
  }

  // Formatea la fecha para que sea compatible con el input de tipo datetime-local
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16);
  }

  toggleInscription(): void {
    const inscriptionBeginControl = this.eventForm.get('whenForm')?.get('inscriptionBegin');
    const inscriptionEndControl = this.eventForm.get('whenForm')?.get('inscriptionEnd');
    const maxParticipantsControl = this.eventForm.get('whoForm')?.get('maxParticipants');

    if (this.inscriptionToggle) {
      inscriptionBeginControl?.enable();
      inscriptionEndControl?.enable();
      maxParticipantsControl?.enable();
    } else {
      inscriptionBeginControl?.disable();
      inscriptionEndControl?.disable();
      maxParticipantsControl?.disable();
    }
  }

  handleGameSelected(game: Game): void {
    this.gamemodesLoading = true;
    this.platformsLoading = true;
    this.selectedGame = game;

    this.eventForm.get('whoForm')?.reset({ privacy: 'default' })

    // Restablecer los campos de gamemode y platform a su valor predeterminado y marcarlos como "no tocados"
    const whatForm = this.eventForm.get('whatForm');
    if (whatForm) {
      whatForm.patchValue({
        gamemode: 'default',
        platform: 'default'
      });
      whatForm.get('gamemode')?.markAsUntouched();
      whatForm.get('platform')?.markAsUntouched();
    }

    const rankedControl = this.eventForm.get('whatForm')?.get('ranked');
    if (rankedControl) {
      // Obtener todos los gamemodes una vez
      this.apiService.newGetFullGame(game.id).subscribe(fullGame => {
        this.gamemodes = fullGame.gamemodes;
        this.platforms = fullGame.platforms;

        // Si hay un evento, establece los valores de gamemode y platform
        if (this.event) {

          const gamemode = this.gamemodes.find(gamemode => gamemode.name === this.event.game_mode);
          const platform = this.platforms.find(platform => platform.platform === this.event.platform);

          rankedControl.setValue(gamemode?.ranked ? true : false);

          this.maxPlayers = this.event.max_participants;
          this.ranks = gamemode?.ranks || [''];

          if (gamemode && platform) {
            const whatForm = this.eventForm.get('whatForm');
            if (whatForm) {
              whatForm.patchValue({
                gamemode: gamemode.id,
                platform: platform.id
              });
            }
          }

          this.eventForm.patchValue({
            whatForm: {
              title: this.event.event_title,
            },
            whenForm: {
              inscriptionToggle: this.event.date_time_inscription_begin && this.event.date_time_inscription_end ? true : false,
              eventBegin: this.formatDateTime(this.event.date_time_begin as string),
              eventEnd: this.formatDateTime(this.event.date_time_end as string),
              inscriptionBegin: this.formatDateTime(this.event.date_time_inscription_begin as string),
              inscriptionEnd: this.formatDateTime(this.event.date_time_inscription_end as string)
            },
            whoForm: {
              privacy: this.event.privacy,
              maxParticipants: this.event.max_participants,
              requirmentsToggle: this.hasRequirements(),
              rank: this.event.event_requirements.max_rank || this.event.event_requirements.min_rank ? true : false,
              maxRank: this.event.event_requirements.max_rank,
              minRank: this.event.event_requirements.min_rank,
              level: this.event.event_requirements.max_level || this.event.event_requirements.min_level ? true : false,
              maxLevel: this.event.event_requirements.max_level,
              minLevel: this.event.event_requirements.min_level,
              hoursPlayed: this.event.event_requirements.max_hours_played || this.event.event_requirements.min_hours_played ? true : false,
              maxHours: this.event.event_requirements.max_hours_played,
              minHours: this.event.event_requirements.min_hours_played
            }
          });

          this.updateDataLoading = false;
        }

        // Filtrar los gamemodes con el valor inicial de ranked
        const initialRanked = rankedControl.value;
        if (initialRanked !== null && initialRanked !== undefined) {
          this.filteredGamemodes = this.gamemodes.filter(gamemode => !!gamemode.ranked === initialRanked);
        }

        // Suscribirse a valueChanges para actualizar el filtro cuando cambie el valor de ranked
        this.subscriptions.push(
          rankedControl.valueChanges.subscribe(ranked => {
            if (ranked !== null && ranked !== undefined) {
              this.filteredGamemodes = this.gamemodes.filter(gamemode => !!gamemode.ranked === ranked);
            }
          })
        );

        this.gamemodesLoading = false;
        this.platformsLoading = false;
      });
    }
  }

  //Comprueba si this.event.event_requirments tiene algún requirtment !== a null
  hasRequirements(): boolean {
    const eventRequirements = this.event.event_requirements;
    return Object.values(eventRequirements).some(value => value !== null);
  }

  handleGamesLoaded(games: Game[]): void {
    this.games = games;
  }

  handleSelectGameTouched() {
    this.eventForm?.get('whatForm')?.get('game')?.markAsTouched();
  }

  isInvalid(group: string, fieldName: string) {
    const field = this.eventForm.get(group)?.get(fieldName);
    return field?.invalid && field?.touched || false;
  }

  isSubFormGroupValid(subGroupName: string): boolean {
    const subGroup = this.eventForm.get(subGroupName) as FormGroup;
    return subGroup?.valid || false;
  }

  nextTab(): void {
    // Convertir QueryList a array
    const tabArray = this.tabs.toArray();

    // Encuentra el radio input actualmente seleccionado
    const selectedIndex = tabArray.findIndex(tab => tab.nativeElement.checked);

    // Si se encontró un radio input seleccionado y no es el último, selecciona el siguiente
    if (selectedIndex !== -1 && selectedIndex < tabArray.length - 1) {
      tabArray[selectedIndex + 1].nativeElement.checked = true;
    }
  }

  async onSubmit(): Promise<void> {
    this.isFormSubmmiting = true;

    const gamemode = this.gamemodes.find(mode => mode.id == this.eventForm?.get('whatForm')?.get('gamemode')?.value);
    const platform = this.platforms.find(plat => plat.id == this.eventForm?.get('whatForm')?.get('platform')?.value);

    const inscriptionToggle = this.eventForm?.get('whenForm')?.get('inscriptionToggle')?.value;

    this.userService.getLogedUserData().subscribe((userData: UserData) => {
      const eventOwnerId = userData.id;


      const formatedNewEvent: FormatedNewEvent = {
        data: {
          event: {
            event_title: this.eventForm?.get('whatForm.title')?.value,
            game_id: this.eventForm?.get('whatForm.game')?.value.id,
            game_name: this.eventForm?.get('whatForm.game')?.value.name,
            game_mode: gamemode?.name || '',
            game_pic: this.eventForm?.get('whatForm.game')?.value.image,
            platform: platform?.platform || '',
            event_owner_id: eventOwnerId,
            date_time_begin: this.eventForm?.get('whenForm.eventBegin')?.value,
            date_time_end: this.eventForm?.get('whenForm.eventEnd')?.value,
            date_time_inscription_begin: inscriptionToggle ? this.eventForm?.get('whenForm.inscriptionBegin')?.value : null,
            date_time_inscription_end: inscriptionToggle ? this.eventForm?.get('whenForm.inscriptionEnd')?.value : null,
            max_participants: this.eventForm?.get('whoForm.maxParticipants')?.value || 0,
            privacy: this.eventForm.get('whoForm')?.get('privacy')?.value
          },
          event_requirements: {
            max_rank: this.eventForm.get('whoForm.maxRank')?.value || null,
            min_rank: this.eventForm?.get('whoForm.minRank')?.value || null,
            max_level: this.eventForm?.get('whoForm.maxLevel')?.value || null,
            min_level: this.eventForm?.get('whoForm.minLevel')?.value || null,
            max_hours_played: this.eventForm?.get('whoForm.maxHours')?.value || null,
            min_hours_played: this.eventForm?.get('whoForm.minHours')?.value || null,
          }
        }
      };


      console.log('Form submitted', formatedNewEvent);

      if (this.isUpdating) {
        this.eventService.updateEvent(this.event.id, formatedNewEvent).subscribe(
          () => {
            this.isFormSubmmiting = false;
            this.alertService.showAlert('success', 'Evento actualizado con éxito! 😄');
            this.closeModal();
            this.profileService.eventEdited.next();

          },
          (error) => {
            this.alertService.showAlert('error', 'Error! Algo ha fallado al actualizar el evento. 😓');
            this.isFormSubmmiting = false;
            console.error(error);
          }
        );
      } else {
        this.eventService.postNewEvent(formatedNewEvent).subscribe(
          () => {
            this.isFormSubmmiting = false;
            this.alertService.showAlert('success', 'Evento creado con éxito! 😄');
            this.closeModal();
            this.profileService.eventCreated.next();

          },
          (error) => {
            this.alertService.showAlert('error', 'Error! Algo ha fallado al crear el evento. 😓');
            this.isFormSubmmiting = false;
            console.error(error);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    // Cancelar todas las suscripciones cuando se destruye el componente para evitar fugas de memoria.
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  //Validaciones ______________________________________________________

  //whatForm validations ______________________________________________________

  // Que el titulo no tenga solo espacios
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { 'whitespace': { value: control.value } } : null;
    };
  }

  //Comprueba si el campo game contiene un juego que existe en el array de juegos
  gameExists(control: AbstractControl): ValidationErrors | null {
    if (control.value === null || control.value === undefined) {
      return null;
    }
    const game = this.games.find(g => g.id === control.value.id);
    return game ? null : { gameNotFound: true };
  }

  //Comprueba que el gamemode seleccionado pertenece al game selecionado
  gamemodeBelongsToGame(control: AbstractControl): ValidationErrors | null {
    const gamemode = this.gamemodes.find(gm => gm.id == control.value);
    return gamemode && this.selectedGame && gamemode.game_id === this.selectedGame.id ? null : { gamemodeNotBelongsToGame: true };
  }

  // Comprueba que la plataforma seleccionada pertenece al game selecionado
  platformBelongsToGame(control: AbstractControl): ValidationErrors | null {
    const platformExists = this.platforms.some(platform => platform.id == control.value);
    return platformExists ? null : { platformNotBelongsToGame: true };
  }

  //whenForm validations ______________________________________________________

  dateRangeValidator(form: FormGroup) {
    const eventBegin = form.get('eventBegin');
    const eventEnd = form.get('eventEnd');
    const inscriptionBegin = form.get('inscriptionBegin');
    const inscriptionEnd = form.get('inscriptionEnd');

    // Si eventBegin y eventEnd tienen valores, comprueba si eventBegin es mayor que eventEnd
    if (eventBegin && eventEnd && eventBegin.value && eventEnd.value) {
      if (eventBegin.value > eventEnd.value) {
        // Si eventBegin es mayor que eventEnd, establece un error de 'dateRange' en eventEnd
        eventEnd.setErrors({ 'dateRange': true });
      } else {
        // Si eventBegin no es mayor que eventEnd, limpia los errores en eventEnd
        eventEnd.setErrors(null);
      }
    }

    // Si inscriptionBegin e inscriptionEnd tienen valores y no están deshabilitados, comprueba si inscriptionBegin es mayor que inscriptionEnd
    if (inscriptionBegin && inscriptionEnd && inscriptionBegin.value && inscriptionEnd.value && !inscriptionBegin.disabled && !inscriptionEnd.disabled) {
      if (inscriptionBegin.value > inscriptionEnd.value) {
        // Si inscriptionBegin es mayor que inscriptionEnd, establece un error de 'dateRange' en inscriptionEnd
        console.log('inscriptionBegin > inscriptionEnd')

        inscriptionEnd.setErrors({ 'dateRange': true });
      } else {
        // Si inscriptionBegin no es mayor que inscriptionEnd, limpia los errores en inscriptionEnd
        inscriptionEnd.setErrors(null);
      }
    }

    // Si eventEnd e inscriptionEnd tienen valores y inscriptionEnd no está deshabilitado, comprueba si inscriptionEnd es mayor que eventEnd
    if (eventEnd && inscriptionEnd && eventEnd.value && inscriptionEnd.value && !inscriptionEnd.disabled) {
      if (inscriptionEnd.value > eventEnd.value) {
        // Si inscriptionEnd es mayor que eventEnd, establece un error de 'dateRangeI' en inscriptionEnd
        inscriptionEnd.setErrors({ 'dateRangeI': true });
      } else if (!inscriptionEnd.errors || Object.keys(inscriptionEnd.errors).length === 0) {
        // Si inscriptionEnd no es mayor que eventEnd y no tiene errores, limpia los errores en inscriptionEnd
        inscriptionEnd.setErrors(null);
      }
    }
  }

  notInPastValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === null || control.value === undefined) {
        return null;
      }
      const now = new Date();
      const selectedDate = new Date(control.value);
      return selectedDate < now ? { 'inPast': { value: control.value } } : null;
    };
  }

  //whoForm validations ______________________________________________________

  //Comprueba que la privacidad selecionada no sea la por defecto
  privacyNotDefault(control: AbstractControl): ValidationErrors | null {
    return control.value === 'default' ? { privacyNotDefault: true } : null;
  }

  //Comprueba que el valor de maxParticipants sea mayor que 0
  minZero(control: AbstractControl) {
    const value = control.value;
    return value >= 0 ? null : { minZero: true };
  }

  //Comprueba que no se superan los max_players del gamemode
  maxPlayersValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value === null || value === undefined) {
      return null;
    }
    return value > this.maxPlayers ? { maxPlayersExceeded: true } : null;
  }

  //Comprueba que el valor de max* sea mayor que el de min*
  maxGreaterThanMin(maxControlName: string, minControlName: string) {
    return (group: FormGroup) => {
      const maxControl = group.controls[maxControlName];
      const minControl = group.controls[minControlName];
      if (maxControl.value < minControl.value) {
        return maxControl.setErrors({ maxLessThanMin: true });
      }
    };
  }

  //Comprueba que el valor de minRank sea menor que el de maxRank
  rankOrderValidator(minControlName: string, maxControlName: string) {
    return (group: FormGroup) => {
      const minControl = group.controls[minControlName];
      const maxControl = group.controls[maxControlName];
      const minRankIndex = this.ranks.indexOf(minControl.value);
      const maxRankIndex = this.ranks.indexOf(maxControl.value);
      if (minRankIndex > maxRankIndex) {
        maxControl.setErrors({ minGreaterThanMax: true });
        return { minGreaterThanMax: true };
      }
      return null;
    };
  }

  integerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isInteger = Number.isInteger(Number(control.value));
      return !isInteger ? { 'notInteger': { value: control.value } } : null;
    };
  }
}
