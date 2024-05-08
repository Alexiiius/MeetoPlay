import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatsComponent } from './components/chats/chats.component';
import { EventsComponent } from './components/events/events.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProfilecardComponent } from './components/profilecard/profilecard.component';
import { NewEventFormComponent } from './components/new-event-form/new-event-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatsComponent,
    EventsComponent,
    FiltersComponent,
    ProfilecardComponent,
    NewEventFormComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontEnd';

}
