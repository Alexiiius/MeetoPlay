import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.whenForm = this.formBuilder.group({
      toggle: [true],
      eventBegin: ['', [Validators.required, this.notInPastValidator()]],
      eventEnd: ['', Validators.required],
      inscriptionBegin: ['', Validators.required],
      inscriptionEnd: ['', Validators.required]
    });

    this.whenForm.get('eventBegin')?.valueChanges.subscribe((value) => {
      if (value) {
        const eventBeginDate = new Date(value);
        const inscriptionEndDate = new Date(eventBeginDate);

        // Formatea la fecha al formato correcto
        const formattedDate = inscriptionEndDate.toISOString().slice(0, 16);
        this.whenForm.get('inscriptionEnd')?.setValue(formattedDate);

        const inscriptionBeginDate = new Date(inscriptionEndDate);
        inscriptionBeginDate.setDate(inscriptionEndDate.getDate() - 7);

        // Formatea la fecha al formato correcto
        const formattedBeginDate = inscriptionBeginDate.toISOString().slice(0, 16);
        this.whenForm.get('inscriptionBegin')?.setValue(formattedBeginDate);

        // Detecta los cambios después de establecer los valores
        this.cdr.detectChanges();
      }
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

  notInPastValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const now = new Date();
      const selectedDate = new Date(control.value);
      return selectedDate < now ? { 'inPast': { value: control.value } } : null;
    };
  }

  onSubmit(): void {
    console.log(this.whenForm.value);
    this.router.navigate(['/newEvent/who']);
  }
}
