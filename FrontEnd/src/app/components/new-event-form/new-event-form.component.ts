import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatFormComponent } from './what-form/what-form.component';
import { ChildrenOutletContexts, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { fadeAnimation } from './formAnimations';

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
  styleUrl: './new-event-form.component.css',
  animations: [fadeAnimation]
})
export class NewEventFormComponent {

  constructor(private contexts: ChildrenOutletContexts) {}

  // Método para obtener la animación de la ruta actual
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
