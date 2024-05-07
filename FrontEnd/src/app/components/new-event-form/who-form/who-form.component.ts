import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { NewEventFormService } from '../../../services/new-event-form.service';
import { Gamemode } from '../../../models/gamemode';


@Component({
  selector: 'app-who-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './who-form.component.html',
  styleUrl: './who-form.component.css'
})
export class WhoFormComponent {

  whoForm: FormGroup;
  ranked: boolean;
  selectedGamemode: Gamemode | null;
  toggleInscription: boolean = true;
  ranks: string[] = [''];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private newEventFormService: NewEventFormService,
  ) { }


  ngOnInit() {
    this.whoForm = this.formBuilder.group({
      privacy: ['public', Validators.required], // Para el select de privacidad
      maxParticipants: ['', [Validators.required, this.minZero, this.maxPlayersValidator()]], // Para el input de Max participantes
      toggleRequirments: [false], // Para el checkbox de Requirments
      rank: [false], // Para el checkbox de Rango
      maxRank: [{ value: '', disabled: true }, Validators.required], // Para el input de Max en Rango
      minRank: [{ value: '', disabled: true }, Validators.required], // Para el input de Min en Rango
      level: [false], // Para el checkbox de Por nivel
      maxLevel: [{ value: '', disabled: true }, [Validators.required, this.minZero]], // Para el input de Max en Por nivel
      minLevel: [{ value: '', disabled: true }, [Validators.required, this.minZero]], // Para el input de Min en Por nivel
      hoursPlayed: [false], // Para el checkbox de Horas jugadas
      maxHours: [{ value: '', disabled: true }, [Validators.required, this.minZero]], // Para el input de Max en Horas jugadas
      minHours: [{ value: '', disabled: true }, [Validators.required, this.minZero]] // Para el input de Min en Horas jugadas
    },
      {
        validators: [
          this.rankOrderValidator('minRank', 'maxRank'),
          this.maxGreaterThanMin('maxLevel', 'minLevel'),
          this.maxGreaterThanMin('maxHours', 'minHours')
        ]
      }
    );

    // Suscribirse al valor de 'ranked' en el servicio
    this.newEventFormService.ranked$.subscribe(value => {
      this.ranked = true; // TODO cambiar por value
    });

    // Suscribirse al valor de 'selectedGame' en el servicio
    this.newEventFormService.selectedGamemode$.subscribe(value => {
      this.selectedGamemode = value;
      this.ranks = ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Diamante", "Maestro", "Gran Maestro", "Challenger"]
      // TODO cambiar por esto this.ranks = this.selectedGamemode?.ranks || ['No Ranked Gamemode'];
    });

    this.newEventFormService.toggleInscription$.subscribe(value => {
      this.toggleInscription = value;

      if (this.toggleInscription) {
        this.whoForm.get('maxParticipants')?.enable();
      } else {
        this.whoForm.get('maxParticipants')?.disable();
      }
    });

    // Suscribirse a los cambios en el valor de 'rank'
    this.whoForm.get('rank')?.valueChanges.subscribe(value => {
      if (value) {
        this.whoForm.get('maxRank')?.enable();
        this.whoForm.get('minRank')?.enable();
      } else {
        this.whoForm.get('maxRank')?.disable();
        this.whoForm.get('minRank')?.disable();
      }
    });

    // Suscribirse a los cambios en el valor de 'level'
    this.whoForm.get('level')?.valueChanges.subscribe(value => {
      if (value) {
        this.whoForm.get('maxLevel')?.enable();
        this.whoForm.get('minLevel')?.enable();
      } else {
        this.whoForm.get('maxLevel')?.disable();
        this.whoForm.get('minLevel')?.disable();
      }
    });

    // Suscribirse a los cambios en el valor de 'hoursPlayed'
    this.whoForm.get('hoursPlayed')?.valueChanges.subscribe(value => {
      if (value) {
        this.whoForm.get('maxHours')?.enable();
        this.whoForm.get('minHours')?.enable();
      } else {
        this.whoForm.get('maxHours')?.disable();
        this.whoForm.get('minHours')?.disable();
      }
    });
  }

  isInvalid(fieldName: string) {
    const field = this.whoForm.get(fieldName);
    return field?.invalid && field?.touched;
  }

  minZero(control: AbstractControl) {
    const value = control.value;
    return value >= 0 ? null : { minZero: true };
  }

  maxGreaterThanMin(maxControlName: string, minControlName: string) {
    return (group: FormGroup) => {
      const maxControl = group.controls[maxControlName];
      const minControl = group.controls[minControlName];
      if (maxControl.value < minControl.value) {
        return maxControl.setErrors({ maxLessThanMin: true });
      }
    };
  }

  maxPlayersValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let maxPlayers = this.selectedGamemode?.max_players;
      const forbidden = maxPlayers !== undefined && control.value > maxPlayers;
      return forbidden ? {maxPlayers: {value: control.value}} : null;
    };
  }

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

  onSubmit(): void {
    let storedForm = sessionStorage.getItem('newEventForm');
    let newEventForm = storedForm ? JSON.parse(storedForm) : {};
    newEventForm.whoForm = this.whoForm.value;
    sessionStorage.setItem('newEventForm', JSON.stringify(newEventForm));
    this.newEventFormService.submitWhoForm();
    this.router.navigate(['/main']);
  }
}
