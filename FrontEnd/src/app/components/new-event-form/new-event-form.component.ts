import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatFormComponent } from './what-form/what-form.component';
import { ChildrenOutletContexts, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { fadeAnimation } from './formAnimations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WhenFormComponent } from './when-form/when-form.component';
import { WhoFormComponent } from './who-form/who-form.component';

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
export class NewEventFormComponent implements OnInit {

  newEventForm: FormGroup;

  @Input() whatForm: FormGroup;
  @Input() whenForm: FormGroup;
  @Input() whoForm: FormGroup;

  constructor(
    private contexts: ChildrenOutletContexts,
    private formBuilder: FormBuilder)
    {}

  // Método para obtener la animación de la ruta actual
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  //TODO: Implementar fusión de formularios
  ngOnInit() {
    this.newEventForm = this.formBuilder.group({
      whatForm: this.whatForm,
      whenForm: this.whenForm,
      whoForm: this.whoForm,
    });
  }
}
