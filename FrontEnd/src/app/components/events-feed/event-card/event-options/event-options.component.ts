import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Event } from '../../../../models/event';
import { EventFormComponent } from '../../../event-form/event-form.component';

@Component({
  selector: 'app-event-options',
  standalone: true,
  imports: [
    EventFormComponent
  ],
  templateUrl: './event-options.component.html',
  styleUrl: './event-options.component.css'
})
export class EventOptionsComponent {

  @Input() event: Event;
  @ViewChild('moreEventInfo') modalDialog!: ElementRef<HTMLDialogElement>;
}
