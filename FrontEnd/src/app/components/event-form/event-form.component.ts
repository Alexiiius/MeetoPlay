import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event } from '../../models/event';
import { NewSelectGameComponent } from './new-select-game/new-select-game.component';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NewSelectGameComponent
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {

  // @Input() event: Event;
  eventForm: FormGroup;

  event: any = {
    id: 1,
    event_title: 'Evento de prueba',
    game_id: 1,
    game_name: 'League of Legends',
    game_mode: 'Ranked',
    game_pic: 'https://via.placeholder.com/150',
    platform: 'PC',
    date_time_begin: new Date(),
    date_time_end: new Date(),
    date_time_inscription_begin: new Date(),
    date_time_inscription_end: new Date(),
    privacy: 'public',
    max_participants: 5,
    event_requirements: {
      max_rank: 'Platinum',
      min_rank: 'Silver',
      max_level: 30,
      min_level: 1,
      max_hours_played: 100,
      min_hours_played: 0
    }
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      whatForm: this.formBuilder.group({
        ranked: ['', Validators.required],
        title: ['', Validators.required],
        game: ['', Validators.required],
        platform: ['', Validators.required],
        gameMode: ['', Validators.required],
      }),
      whenForm: this.formBuilder.group({
        inscriptionToggle: ['', Validators.required],
        eventBegin: ['', Validators.required],
        eventEnd: ['', Validators.required],
        inscriptionBegin: ['', Validators.required],
        inscriptionEnd: ['', Validators.required]
      }),
      whoForm: this.formBuilder.group({
        privacy: ['', Validators.required],
        maxParticipants: ['', Validators.required],
        toggleRequirments: ['', Validators.required],
        rank: ['', Validators.required],
        maxRank: ['', Validators.required],
        minRank: ['', Validators.required],
        level: ['', Validators.required],
        maxLevel: ['', Validators.required],
        minLevel: ['', Validators.required],
        hoursPlayed: ['', Validators.required],
        maxHours: ['', Validators.required],
        minHours: ['', Validators.required]
      })
    });

    // Si el evento existe, establece los valores del formulario
    if (this.event) {
      this.eventForm.patchValue({
        whatForm: {
          // ranked: this.event.ranked,
          title: this.event.event_title,
          game: this.event.game_name,
          platform: this.event.platform,
          gameMode: this.event.game_mode,
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

  onSubmit(): void {
    console.log('Form submitted');
  }
}
