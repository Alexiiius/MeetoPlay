import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildrenOutletContexts, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { fadeAnimation } from './formAnimations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NewEventFormService } from '../../services/new-event-form.service';
import { BackEndService } from '../../services/back-end.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-event-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './new-event-form.component.html',
  styleUrl: './new-event-form.component.css',
  animations: [fadeAnimation]
})
export class NewEventFormComponent implements OnInit {

  newEventFormJSON: JSON;
  subscription: Subscription;

  constructor(
    private contexts: ChildrenOutletContexts,
    private backEndService: BackEndService,
    private newEventFormService: NewEventFormService,
  ) {
    sessionStorage.setItem('newEventForm', JSON.stringify({}));
  }

  ngOnInit() {
    this.subscription = this.newEventFormService.whoFormSubmitted$.subscribe(submitted => {
      if (submitted) {
        let storedForm = sessionStorage.getItem('newEventForm');
        if (storedForm) {
          this.newEventFormJSON = JSON.parse(storedForm);
          console.log('Form restored from session storage');
          console.log(this.newEventFormJSON);
          this.submitNewEventForm();
        }
      }
    });
  }

  // Método para obtener la animación de la ruta actual
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  submitNewEventForm() {
    console.log('New event form submitted');
    console.log(this.newEventFormJSON);
    this.backEndService.postNewEvent(this.newEventFormJSON);
  }
}
