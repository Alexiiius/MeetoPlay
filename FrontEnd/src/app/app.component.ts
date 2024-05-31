import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatsComponent } from './components/chats/chats.component';
import { EventsFeedComponent } from './components/events-feed/events.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProfilecardComponent } from './components/profilecard/profilecard.component';
import { NewEventFormComponent } from './components/new-event-form/new-event-form.component';
import { AuthService } from './services/auth.service';
import { connect } from 'rxjs';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatsComponent,
    EventsFeedComponent,
    FiltersComponent,
    ProfilecardComponent,
    NewEventFormComponent,
    HttpClientModule,
    SplashScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'MeetoPlay';

  constructor() {
  }

  authService = inject(AuthService);

  splashScreenVisible: boolean = true;

  ngOnInit(): void {
    console.log('Checking token');
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      this.authService.checkToken().subscribe({
        next: (response) => {
          if (response) {
            console.log('Token is valid');
            this.authService.isAuth.next(true);
            this.splashScreenVisible = false;
          }
        },
        error: (error) => {
          this.authService.isAuth.next(false);
          this.splashScreenVisible = false;
          console.log(error);
        }
      });
    } else {
      this.authService.isAuth.next(false);
      this.splashScreenVisible = false;
    }
  }
}
