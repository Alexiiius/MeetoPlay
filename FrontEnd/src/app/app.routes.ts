import { Routes } from '@angular/router';

import { EventsFeedComponent } from './components/events-feed/events.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MainComponent } from './components/main/main.component';
import { authGuard, loggedGuard } from './auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { GameStatsComponent } from './components/profile/game-stats/game-stats.component';
import { MyEventsComponent } from './components/profile/my-events/my-events.component';
import { ParticipatingComponent } from './components/profile/participating/participating.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main', component: MainComponent, canActivate: [authGuard], children: [
      { path: '', component: EventsFeedComponent },
      {
        path: 'profile/:id', component: ProfileComponent, children: [
          { path: '', redirectTo: 'gameStats', pathMatch: 'full' },
          { path: 'gameStats', component: GameStatsComponent },
          { path: 'myEvents', component: MyEventsComponent },
          { path: 'participating', component: ParticipatingComponent },
        ]
      }
    ]
  },
  { path: 'login', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'login' } },
  { path: 'register', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'register' } },

  // otras rutas aquí
  { path: '**', redirectTo: 'main' },
];
