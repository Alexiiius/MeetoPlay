import { Routes } from '@angular/router';
import { NewEventFormComponent } from './components/new-event-form/new-event-form.component';
import { WhatFormComponent } from './components/new-event-form/what-form/what-form.component';
import { WhenFormComponent } from './components/new-event-form/when-form/when-form.component';

import { MainComponent } from './components/main/main.component';
import { EventsComponent } from './components/events/events.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'},
  { path: 'main', component: EventsComponent },
  {
    path: 'newEvent',
    component: NewEventFormComponent,
    children: [
      { path: '', redirectTo: 'what', pathMatch: 'full' },
      { path: 'what', component: WhatFormComponent },
      { path: 'when', component: WhenFormComponent },
      // otras rutas hijas aquí
    ]
  },
  // otras rutas aquí
  { path: '**', redirectTo: 'main'},
];
