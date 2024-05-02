import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatsComponent } from '../chats/chats.component';
import { EventsComponent } from '../events/events.component';
import { FiltersComponent } from '../filters/filters.component';
import { ProfilecardComponent } from '../profilecard/profilecard.component';
import { NewEventFormComponent } from '../new-event-form/new-event-form.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatsComponent,
    EventsComponent,
    FiltersComponent,
    ProfilecardComponent,
    NewEventFormComponent,
    HttpClientModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  title = 'FrontEnd';
}
