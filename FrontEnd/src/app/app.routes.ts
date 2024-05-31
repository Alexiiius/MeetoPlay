import { Routes } from '@angular/router';

import { EventsFeedComponent } from './components/events-feed/events.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MainComponent } from './components/main/main.component';
import { authGuard, loggedGuard } from './auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { GameStatsComponent } from './components/profile/game-stats/game-stats.component';
import { MyEventsComponent } from './components/profile/my-events/my-events.component';
import { ParticipatingEventsComponent } from './components/profile/participating-events/participating-events.component';

export const routes: Routes = [
  {
    path: '', component: MainComponent, canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', title: 'Meetoplay | Main', component: EventsFeedComponent },
      {
        path: 'profile/:id', title: 'Meetoplay | Profile', component: ProfileComponent, children: [
          { path: '', redirectTo: 'gameStats', pathMatch: 'full' },
          { path: 'gameStats', component: GameStatsComponent },
          { path: 'myEvents', component: MyEventsComponent },
          { path: 'participating', component: ParticipatingEventsComponent },
          { path: '**', redirectTo: 'gameStats' }
        ]
      },
      { path: '**', redirectTo: 'main' }
    ]
  },
  { path: 'login', title: 'Meetoplay | Login', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'login' } },
  { path: 'register', title: 'Meetoplay | Register', component: LoginRegisterComponent, canActivate: [loggedGuard], data: { mode: 'register' } }

  // otras rutas aquí

];
