import { Routes } from '@angular/router';

import { NewEventFormComponent } from './components/new-event-form/new-event-form.component';
import { WhatFormComponent } from './components/new-event-form/what-form/what-form.component';
import { WhenFormComponent } from './components/new-event-form/when-form/when-form.component';
import { WhoFormComponent } from './components/new-event-form/who-form/who-form.component';
import { EventsFeedComponent } from './components/events-feed/events.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MainComponent } from './components/main/main.component';
import { authGuard, loggedGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'},
  { path: 'main', component: MainComponent, canActivate: [authGuard], children: [
    { path: '', component: EventsFeedComponent },
    {
      path: 'newEvent',
      component: NewEventFormComponent,
      children: [
        { path: '', redirectTo: 'what', pathMatch: 'full' },
        { path: 'what', component: WhatFormComponent, data: { animation: 'whatAnim' }},
        { path: 'when', component: WhenFormComponent, data: { animation: 'whenAnim' }},
        { path: 'who', component: WhoFormComponent, data: { animation: 'whoAnim' }},
        // otras rutas hijas aquí
      ]
    },
  ]},
  { path: 'login', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'login' } },
  { path: 'register', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'register' } },

  // otras rutas aquí
  { path: '**', redirectTo: 'main'},
];
