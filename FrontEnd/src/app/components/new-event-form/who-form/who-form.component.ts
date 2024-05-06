import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NewEventFormService } from '../../../services/new-event-form-service.service';

@Component({
  selector: 'app-who-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './who-form.component.html',
  styleUrl: './who-form.component.css'
})
export class WhoFormComponent {

  whoForm: FormGroup;
  ranked: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private newEventFormService: NewEventFormService,
  ) { }


  ngOnInit() {
    this.whoForm = this.formBuilder.group({
      privacy: ['public', Validators.required], // Para el select de privacidad
      toggleRequirments: [true], // Para el checkbox de Requirments // TODO: Cambiar por el valor del servicio
      rank: [false], // Para el checkbox de Rango
      maxRank: [{value: '', disabled: true}, [Validators.required,this.minZero]], // Para el input de Max en Rango
      minRank: [{value: '', disabled: true}, [Validators.required,this.minZero]], // Para el input de Min en Rango
      level: [false], // Para el checkbox de Por nivel
      maxLevel: [{value: '', disabled: true}, [Validators.required,this.minZero]], // Para el input de Max en Por nivel
      minLevel: [{value: '', disabled: true}, [Validators.required,this.minZero]], // Para el input de Min en Por nivel
      hoursPlayed: [false], // Para el checkbox de Horas jugadas
      maxHours: [{value: '', disabled: true}, [Validators.required,this.minZero]], // Para el input de Max en Horas jugadas
      minHours: [{value: '', disabled: true}, [Validators.required,this.minZero]] // Para el input de Min en Horas jugadas
    },
    {
      validators: [
        this.maxGreaterThanMin('maxRank', 'minRank'),
        this.maxGreaterThanMin('maxLevel', 'minLevel'),
        this.maxGreaterThanMin('maxHours', 'minHours')
      ]}
    );

    // Suscribirse al valor de 'ranked' en el servicio
  this.newEventFormService.ranked$.subscribe(value => {
    this.ranked = true; // TODO: Cambiar por el valor del servicio
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

  onSubmit(): void {
    console.log(this.whoForm.value);
  }
}
