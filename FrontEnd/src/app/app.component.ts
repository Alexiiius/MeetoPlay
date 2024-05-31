import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatsComponent } from './components/chats/chats.component';
import { EventsFeedComponent } from './components/events-feed/events.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProfilecardComponent } from './components/profilecard/profilecard.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatsComponent,
    EventsFeedComponent,
    FiltersComponent,
    ProfilecardComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MeetoPlay';

}
