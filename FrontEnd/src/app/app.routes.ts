import { Routes } from '@angular/router';

import { EventsFeedComponent } from './components/events-feed/events.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MainComponent } from './components/main/main.component';
import { authGuard, loggedGuard } from './auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { GameStatsComponent } from './components/profile/game-stats/game-stats.component';
import { MyEventsComponent } from './components/profile/my-events/my-events.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { ParticipatingEventsComponent } from './components/profile/participating-events/participating-events.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main', component: MainComponent, canActivate: [authGuard], children: [
      { path: '', redirectTo: 'profile/1', pathMatch: 'full' },
      {
        path: 'profile/:id', component: ProfileComponent, children: [
          { path: '', redirectTo: 'myEvents', pathMatch: 'full' },
          { path: 'gameStats', component: GameStatsComponent },
          { path: 'myEvents', component: MyEventsComponent },
          { path: 'participating', component: ParticipatingEventsComponent },
        ]
      },
      // otras rutas hijas aquí
    ]
  },
  { path: 'login', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'login' } },
  { path: 'register', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'register' } },
  // otras rutas aquí
  { path: '**', redirectTo: 'main' },
];
