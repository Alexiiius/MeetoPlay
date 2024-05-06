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
      privacy: [''], // Para el select de privacidad
      toggleRequirments: [false], // Para el checkbox de Requirments
      ranked: [false], // Para el checkbox de Rango
      maxRank: [''], // Para el input de Max en Rango
      minRank: [''], // Para el input de Min en Rango
      level: [false], // Para el checkbox de Por nivel
      maxLevel: [''], // Para el input de Max en Por nivel
      minLevel: [''], // Para el input de Min en Por nivel
      hoursPlayed: [false], // Para el checkbox de Horas jugadas
      maxHours: [''], // Para el input de Max en Horas jugadas
      minHours: [''] // Para el input de Min en Horas jugadas
    });

    // Suscribirse al valor de 'ranked' en el servicio
    this.newEventFormService.ranked$.subscribe(value => {
      this.ranked = value;
    });
  }

  isInvalid(fieldName: string) {
    const field = this.whoForm.get(fieldName);
    return field?.invalid && field?.touched;
  }

  onSubmit(): void {
    console.log(this.whoForm.value);
  }
}
