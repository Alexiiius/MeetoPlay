import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatsComponent } from '../chats/chats.component';
import { EventsFeedComponent } from '../events-feed/events.component';
import { FiltersComponent } from '../filters/filters.component';
import { ProfilecardComponent } from '../profilecard/profilecard.component';
import { NewEventFormComponent } from '../new-event-form/new-event-form.component';
import { AuthService } from '../../services/auth.service';
import { APIService } from '../../services/api.service';
import { AlertComponent } from './alert/alert.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatsComponent,
    EventsFeedComponent,
    FiltersComponent,
    ProfilecardComponent,
    NewEventFormComponent,
    HttpClientModule,
    AlertComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  constructor(
    private authService: AuthService,

  ) { }

  ngOnInit() {
    this.authService.getUserData().subscribe();
  }
}
