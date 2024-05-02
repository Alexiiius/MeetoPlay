import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatFormComponent } from './what-form/what-form.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-new-event-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    WhatFormComponent
  ],
  templateUrl: './new-event-form.component.html',
  styleUrl: './new-event-form.component.css'
})
export class NewEventFormComponent {

}
