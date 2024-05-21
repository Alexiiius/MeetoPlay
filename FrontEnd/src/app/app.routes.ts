import { Routes } from '@angular/router';

import { NewEventFormComponent } from './components/new-event-form/new-event-form.component';
import { WhatFormComponent } from './components/new-event-form/what-form/what-form.component';
import { WhenFormComponent } from './components/new-event-form/when-form/when-form.component';
import { WhoFormComponent } from './components/new-event-form/who-form/who-form.component';
import { EventsFeedComponent } from './components/events-feed/events.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MainComponent } from './components/main/main.component';
import { authGuard, loggedGuard } from './auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { GameStatsComponent } from './components/profile/game-stats/game-stats.component';
import { MyEventsComponent } from './components/profile/my-events/my-events.component';
import { ParticipatingComponent } from './components/profile/participating/participating.component';
import { WipComponent } from './components/wip/wip.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'},
  { path: 'main', component: MainComponent, canActivate: [authGuard], children: [
    { path: '', redirectTo: 'profile/1', pathMatch: 'full' },
    { path: 'profile/:id', component: ProfileComponent, children: [
      { path: '', redirectTo: 'myEvents', pathMatch: 'full' },
      { path: 'wip', component: WipComponent },
      { path: 'gameStats', component: GameStatsComponent },
      { path: 'myEvents', component: MyEventsComponent },
      { path: 'participating', component: ParticipatingComponent },
    ]},
    { path: 'newEvent', component: NewEventFormComponent, children: [
      { path: '', redirectTo: 'what', pathMatch: 'full' },
      { path: 'what', component: WhatFormComponent, data: { animation: 'whatAnim' }},
      { path: 'when', component: WhenFormComponent, data: { animation: 'whenAnim' }},
      { path: 'who', component: WhoFormComponent, data: { animation: 'whoAnim' }},
      // otras rutas hijas aquí
    ]},
    // otras rutas hijas aquí
  ]},
  { path: 'login', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'login' } },
  { path: 'register', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'register' } },
  // otras rutas aquí
  { path: '**', redirectTo: 'main'},
];

// export const routes: Routes = [
//   { path: '', redirectTo: 'main/profile', pathMatch: 'full'},
//   { path: 'main', component: MainComponent, canActivate: [authGuard], children: [
//     { path: '', component: EventsFeedComponent },
//     {
//       path: 'newEvent',
//       component: NewEventFormComponent,
//       children: [
//         { path: '', redirectTo: 'what', pathMatch: 'full' },
//         { path: 'what', component: WhatFormComponent, data: { animation: 'whatAnim' }},
//         { path: 'when', component: WhenFormComponent, data: { animation: 'whenAnim' }},
//         { path: 'who', component: WhoFormComponent, data: { animation: 'whoAnim' }},
//         // otras rutas hijas aquí
//       ]
//     },
//     { path: 'profile', component: ProfileComponent }
//   ]},
//   { path: 'login', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'login' } },
//   { path: 'register', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'register' } },

//   // otras rutas aquí
//   { path: '**', redirectTo: 'main/profile'},
// ];
