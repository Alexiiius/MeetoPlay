import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-when-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './when-form.component.html',
  styleUrl: './when-form.component.css'
})
export class WhenFormComponent {

  whenForm: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.whenForm = this.formBuilder.group({
      toggle: [true],
      eventBegin: ['', Validators.required],
      eventEnd: ['', Validators.required],
      inscriptionBegin: ['', Validators.required],
      inscriptionEnd: ['', Validators.required]
    });

    this.whenForm.valueChanges.subscribe(() => {
      this.dateRangeValidator(this.whenForm);
    });

    this.whenForm.get('toggle')?.valueChanges.subscribe((value) => {
      if (value) {
        this.whenForm.get('inscriptionBegin')?.enable();
        this.whenForm.get('inscriptionEnd')?.enable();
      } else {
        this.whenForm.get('inscriptionBegin')?.disable();
        this.whenForm.get('inscriptionEnd')?.disable();
      }
    });
  }


  isInvalid(fieldName: string) {
    const field = this.whenForm.get(fieldName);
    return field?.invalid && field?.touched;
  }

  dateRangeValidator(form: FormGroup) {
    const eventBegin = form.get('eventBegin');
    const eventEnd = form.get('eventEnd');
    const inscriptionBegin = form.get('inscriptionBegin');
    const inscriptionEnd = form.get('inscriptionEnd');

    if (eventBegin && eventEnd && eventBegin.value > eventEnd.value) {
      eventEnd.setErrors({ 'dateRange': true });
    } else {
      eventEnd?.setErrors(null);
    }

    if (inscriptionBegin && inscriptionEnd && inscriptionBegin.value > inscriptionEnd.value) {
      inscriptionEnd.setErrors({ 'dateRange': true });
    } else {
      inscriptionEnd?.setErrors(null);
    }

    if (eventEnd && inscriptionEnd && inscriptionEnd.value > eventEnd.value) {
      inscriptionEnd.setErrors({ 'dateRange': true });
    } else if (!inscriptionEnd?.errors || !inscriptionEnd.errors['dateRange']) {
      inscriptionEnd?.setErrors(null);
    }
  }

  onSubmit(): void {
    console.log(this.whenForm.value);
    this.router.navigate(['/newEvent/who']);
  }
}
