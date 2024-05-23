import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event } from '../../models/event';
import { NewSelectGameComponent } from './new-select-game/new-select-game.component';
import { Game } from '../../models/game';
import { FullGame } from '../../models/fullgame';
import { APIService } from '../../services/api.service';
import { Subscription, filter } from 'rxjs';
import { Gamemode } from '../../models/gamemode';
import { Platform } from '../../models/platform';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NewSelectGameComponent,
    CommonModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit, OnDestroy {

  @Input() event: Event;
  eventForm: FormGroup;

  // event: any = {
  //   id: 1,
  //   event_title: 'Evento de prueba',
  //   game_id: 1,
  //   game_name: 'League of Legends',
  //   game_mode: 'Ranked',
  //   game_pic: 'https://via.placeholder.com/150',
  //   platform: 'PC',
  //   date_time_begin: new Date(),
  //   date_time_end: new Date(),
  //   date_time_inscription_begin: new Date(),
  //   date_time_inscription_end: new Date(),
  //   privacy: 'public',
  //   max_participants: 5,
  //   event_requirements: {
  //     max_rank: 'Platinum',
  //     min_rank: 'Silver',
  //     max_level: 30,
  //     min_level: 1,
  //     max_hours_played: 100,
  //     min_hours_played: 0
  //   }
  // };

  fullGame: FullGame;
  gamemodes: Gamemode[] = [];
  filteredGamemodes: Gamemode[] = [];
  platforms: Platform[] = [];

  gamemodesLoading = false;
  platformsLoading = false;

  inscriptionToggle: boolean = true;
  ranked: boolean = false;

  ranks: string[] = [''];

  private subscriptions: Subscription[] = [];

  @ViewChildren('tab') tabs: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder, private apiService: APIService) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      whatForm: this.formBuilder.group({
        ranked: [false],
        title: ['', Validators.required],
        game: [{ id: -1, name: '👾 Seleccione un juego', image: '' }, Validators.required],
        gamemode: ['default', Validators.required],
        platform: ['default', Validators.required],
      }),
      whenForm: this.formBuilder.group({
        inscriptionToggle: [true],
        eventBegin: ['', Validators.required],
        eventEnd: ['', Validators.required],
        inscriptionBegin: ['', Validators.required],
        inscriptionEnd: ['', Validators.required]
      }),
      whoForm: this.formBuilder.group({
        privacy: ['', Validators.required],
        maxParticipants: ['', Validators.required],
        requirmentsToggle: [false],
        rank: [false, Validators.required],
        maxRank: ['', Validators.required],
        minRank: ['', Validators.required],
        level: [false, Validators.required],
        maxLevel: ['', Validators.required],
        minLevel: ['', Validators.required],
        hoursPlayed: [false, Validators.required],
        maxHours: ['', Validators.required],
        minHours: ['', Validators.required]
      })
    });

    this.eventForm.get('whenForm')?.get('inscriptionToggle')?.valueChanges.subscribe(value => {
      this.inscriptionToggle = value;
    });

    this.eventForm.get('whatForm')?.get('ranked')?.valueChanges.subscribe(value => {
      this.ranked = value;
    });

    this.eventForm.get('whatForm')?.get('gamemode')?.valueChanges.subscribe(gamemodeId => {
      // Busca el gamemode en el array filteredGamemodes utilizando el ID
      const gamemode = this.filteredGamemodes.find(gm => gm.id == gamemodeId);

      // Si se encontró el gamemode, actualiza los ranks
      if (gamemode) {
        this.ranks = gamemode.ranks;
      }
    });

    // Si el evento existe, establece los valores del formulario
    if (this.event) {
      this.eventForm.patchValue({
        whatForm: {
          // ranked: this.event.ranked,
          title: this.event.event_title,
          game: this.event.game_name,
          platform: this.event.platform,
          gamemode: this.event.game_mode,
        },
        whenForm: {
          // inscriptionToggle: this.event.inscriptionToggle,
          eventBegin: this.event.date_time_begin,
          eventEnd: this.event.date_time_end,
          inscriptionBegin: this.event.date_time_inscription_begin,
          inscriptionEnd: this.event.date_time_inscription_end
        },
        whoForm: {
          privacy: this.event.privacy,
          maxParticipants: this.event.max_participants,
          // toggleRequirments: this.event.toggleRequirments,
          // rank: this.event.rank,
          maxRank: this.event.event_requirements.max_rank,
          minRank: this.event.event_requirements.min_rank,
          // level: this.event.level,
          maxLevel: this.event.event_requirements.max_level,
          minLevel: this.event.event_requirements.min_level,
          // hoursPlayed: this.event.hoursPlayed,
          maxHours: this.event.event_requirements.max_hours_played,
          minHours: this.event.event_requirements.min_hours_played
        }
      });
    }
  }

  handleGameSelected(game: Game): void {
    this.gamemodesLoading = true;
    this.platformsLoading = true;

    const rankedControl = this.eventForm.get('whatForm')?.get('ranked');
    if (rankedControl) {
      // Obtener todos los gamemodes una vez
      this.apiService.newGetFullGame(game.id).subscribe(fullGame => {
        this.gamemodes = fullGame.gamemodes;

        this.platforms = fullGame.platforms;

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

  onSubmit(): void {
    console.log('Form submitted', this.eventForm.value);
  }

  ngOnDestroy() {
    // Cancelar todas las suscripciones cuando se destruye el componente para evitar fugas de memoria.
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
