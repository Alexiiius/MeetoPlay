import { Component } from '@angular/core';
import { EventCardComponent } from '../../events-feed/event-card/event-card.component';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent {

}
