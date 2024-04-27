import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-new-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './new-event-form.component.html',
  styleUrl: './new-event-form.component.css'
})
export class NewEventFormComponent {

  constructor(private formBuilder: FormBuilder) { }

  newEventForm = this.formBuilder.group({
    what: this.formBuilder.group({
      title: ['', Validators.required],
      game: ['', Validators.required],
      platform: ['', Validators.required],
      gameMode: ['', Validators.required],
    }),
    when: this.formBuilder.group({
      dateTimeBegin: ['', Validators.required],
      dateTimeEnd: ['', Validators.required],
    }),
  });

  // Propiedades para controlar la visibilidad de cada bloque
  showWhatBlock = true;
  showWhenBlock = false;
  showRequirementsBlock = false;
  showInscriptionBlock = false;
  showWhoBlock = false;
  showSubmitBtn = false;
  nextBtnState = 'disabled';
  // Agrega más propiedades si tienes más bloques

  // Método para pasar al siguiente bloque
  nextBlock() {
    if (this.showWhatBlock) {
      this.showWhatBlock = false;
      this.showWhenBlock = true;
    } else if (this.showWhenBlock) {
      this.showWhenBlock = false;
      this.showRequirementsBlock = true;
    } else if (this.showRequirementsBlock) {
      this.showRequirementsBlock = false;
      this.showInscriptionBlock = true;
    } else if (this.showInscriptionBlock) {
      this.showInscriptionBlock = false;
      this.showWhoBlock = true;
    } else if (this.showWhoBlock) {
      this.showWhoBlock = false;
      this.showSubmitBtn = true;
    }
  }


  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.newEventForm.value);
  }
}

