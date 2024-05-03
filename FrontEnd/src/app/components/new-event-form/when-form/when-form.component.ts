import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

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

  constructor (
    private FormBuilder: FormBuilder
  ) { }

  whenForm = this.FormBuilder.group({
    datetimebegin: ['', Validators.required],
    datetimeend: ['', Validators.required]
  });
}
